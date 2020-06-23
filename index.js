const { exporter } = require('./exporter')
const { parse } = require('./parser')
const { promisify } = require('util')
const algoliasearch = require('algoliasearch')
const chalk = require('chalk')
const fs = require('fs')
const globby = require('globby')
const path = require('path')
const readFile = promisify(fs.readFile)

const {
  ALGOLIA_APPLICATION_ID: algoliaAppId,
  AlGOLIA_ADMIN_KEY: algoliaAdminKey,
  ALGOLIA_INDEX: algoliaIndex
} = process.env

module.exports = {
  async onPostBuild(opts) {
    const {
      inputs: {
        // custom stopwords to remove from text body, removed before textLength limit applied
        stopwords = [],
        // leave space for keywords and meta - algolia has a 10k byte limit per object
        textLength = 7000,
        // paths to exclude from glob before parse
        exclude = [],
        // output filename
        debugMode,
      },
      constants: { PUBLISH_DIR },
      utils: { build }
    } = opts

    // Check environment variables have been set
    if (algoliaAppId === null ||
      algoliaAdminKey === null ||
      algoliaIndex === null) {
      build.failPlugin(
        'Please set your ALGOLIA_APPLICATION_ID, AlGOLIA_ADMIN_KEY, and ALGOLIA_INDEX using environment variables: https://docs.netlify.com/configure-builds/environment-variables'
      )
    }

    if (debugMode) {
      console.warn(`${chalk.yellow(
        '@netlify/plugin-algolia-index:'
      )} ${chalk.blueBright('debugMode')} is not implemented yet for this plugin`)
    }

    // Walk publish directory for files to parse
    const newManifest = await walk(PUBLISH_DIR, exclude)

    // Parse all files for their indexable content
    let newIndex = []
    await Promise.all(
      newManifest.map(async (htmlFilePath) => {
        const htmlFileContent = await readFile(htmlFilePath, 'utf8')
        newIndex.push(await parse(htmlFileContent, htmlFilePath, { PUBLISH_DIR, textLength, stopwords }))
      })
    )

    // Export content to Algolia
    try {
      const client = algoliasearch(algoliaAppId, algoliaAdminKey)
      const index = client.initIndex(algoliaIndex)
      await exporter(index, newIndex)
    } catch (error) {
      console.error(error)
      // Not exporting to search index doesn't fail the entire build
      build.failPlugin(`Export to Algolia failed - "${error.message}"`)
    }

    console.info(`${chalk.green(
      '@netlify/plugin-algolia-index:'
    )} Export to Algolia app ${chalk.cyan(algoliaAppId)}/${chalk.cyan(algoliaIndex)} finished`)
  }
}

async function walk(dir, exclude = []) {
  return (await globby(path.join(dir, '**/*.html')))
    .filter(p =>
      exclude
      .find(r => p.replace(dir, '').match(r)) === undefined
    )
}
