const path = require('path')
const fs = require('fs')
const globby = require('globby')
const { promisify } = require('util')
const chalk = require('chalk')
const makeDir = require('make-dir')
const pathExists = require('path-exists')

const { parse } = require('./parser')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

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
        indexName = 'searchIndex',
        debugMode,
      },
      constants: { PUBLISH_DIR },
      utils: { build }
    } = opts

    if (indexName === null) {
      build.failPlugin(
        'indexName cannot be null, this plugin wouldn\'t generate anything!'
      )
    }
    if (debugMode) {
      console.warn('debugMode is not implemented yet for this plugin')
    }

    let searchIndex = []
    const newManifest = await walk(PUBLISH_DIR, exclude)

    // https://www.npmjs.com/package/html-to-text#user-content-options
    await Promise.all(
      newManifest.map(async (htmlFilePath) => {
        const htmlFileContent = await readFile(htmlFilePath, 'utf8')
        searchIndex.push(await parse(htmlFileContent, htmlFilePath, { PUBLISH_DIR, textLength, stopwords }))
      })
    )

    let stringifiedIndex = JSON.stringify(searchIndex)

    /**
     *
     * clientside JSON
     *
     */
    if (indexName) {
      let searchIndexPath = path.join(
        PUBLISH_DIR,
        indexName + '.json'
      )
      if (await pathExists(searchIndexPath)) {
        console.warn(
          `Existing file at ${searchIndexPath}, plugin will overwrite it but this may indicate an accidental conflict. Delete this file from your repo to avoid confusion - the plugin should be the sole manager of your search index`
        )
        // to do: let people turn off this warning?
      }
      await makeDir(`${searchIndexPath}/..`) // make a dir out of the parent
      await writeFile(searchIndexPath, stringifiedIndex)
      console.log(
        `Search Index JSON generated at ${chalk.cyan(
          `/${indexName}.json`
        )}!`
      )
    }
  }
}

async function walk(dir, exclude = []) {
  return (await globby(path.join(dir, '**/*.html')))
    .filter(p =>
      exclude
      .find(r => p.replace(dir, '').match(r)) === undefined
    )
}
