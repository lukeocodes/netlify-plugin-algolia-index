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

function netlifyPluginSearchIndex(_) {
  return {
    name: 'netlify-plugin-algolia-index',
    async onPostBuild(opts) {
      const {
        pluginConfig: {
          exclude = [],
          publishDirJSONFileName = 'searchIndex',
          debugMode,
        },
        constants: { BUILD_DIR, FUNCTIONS_SRC, FUNCTIONS_DIST },
        utils: { build }
      } = opts

      if (publishDirJSONFileName === null) {
        build.failPlugin(
          'publishDirJSONFileName cannot be null, this plugin wouldn\'t generate anything!'
        )
      }
      if (debugMode) {
        console.warn('debugMode is not implemented yet for this plugin')
      }

      let searchIndex = []
      const newManifest = await walk(BUILD_DIR, exclude)

      // https://www.npmjs.com/package/html-to-text#user-content-options
      await Promise.all(
        newManifest.map(async (htmlFilePath) => {
          const htmlFileContent = await readFile(htmlFilePath, 'utf8')
          searchIndex.push(await parse(htmlFileContent, htmlFilePath, { BUILD_DIR }))
        })
      )

      let stringifiedIndex = JSON.stringify(searchIndex)

      /**
       *
       * clientside JSON
       *
       */
      if (publishDirJSONFileName) {
        let searchIndexPath = path.join(
          BUILD_DIR,
          publishDirJSONFileName + '.json'
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
            `/${publishDirJSONFileName}.json`
          )}!`
        )
      }
    }
  }
}
module.exports = netlifyPluginSearchIndex

async function walk(dir, exclude = []) {
  return (await globby(path.join(dir, '**/*.html')))
    .filter(p =>
      exclude
      .find(r => p.replace(dir, '').match(r)) === undefined
    )
}
