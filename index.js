const path = require('path')
const fs = require('fs')
const globby = require('globby')
const { promisify } = require('util')
const { parse } = require('./parser')
const { exporter } = require('./exporter')

const {
  ALGOLIA_APPLICATION_ID: algoliaAppId,
  AlGOLIA_ADMIN_KEY: algoliaAdminKey,
  ALGOLIA_INDEX: algoliaIndex
} = process.env

const readFile = promisify(fs.readFile)

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

    if (algoliaAppId === null ||
      algoliaAdminKey === null ||
      algoliaIndex === null) {
      build.failPlugin(
        'Please set your ALGOLIA_APPLICATION_ID, AlGOLIA_ADMIN_KEY, and ALGOLIA_INDEX using environment variables: https://docs.netlify.com/configure-builds/environment-variables'
      )
    }

    if (debugMode) {
      console.warn('debugMode is not implemented yet for this plugin')
    }

    let searchIndex = []
    const newManifest = await walk(PUBLISH_DIR, exclude)

    await Promise.all(
      newManifest.map(async (htmlFilePath) => {
        const htmlFileContent = await readFile(htmlFilePath, 'utf8')
        searchIndex.push(await parse(htmlFileContent, htmlFilePath, { PUBLISH_DIR, textLength, stopwords }))
      })
    )

    // export content to algolia
    await exporter(searchIndex)

    console.info(`Export to Algolia app ${algoliaAppId}/${algoliaIndex} has successfully completed`)
  }
}

async function walk(dir, exclude = []) {
  return (await globby(path.join(dir, '**/*.html')))
    .filter(p =>
      exclude
      .find(r => p.replace(dir, '').match(r)) === undefined
    )
}
