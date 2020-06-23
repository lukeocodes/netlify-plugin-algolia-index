const chalk = require('chalk')

const chunk = (array, size) => {
  var index = 0
  var tempArray = []
  
  for (index = 0; index < array.length; index += size) {
      myChunk = array.slice(index, index+size)
      tempArray.push(myChunk)
  }

  return tempArray
}

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const exporter = async (index, newIndex) => {
  const objectChunks = chunk(newIndex, 50)
  const exports = []

  objectChunks.forEach(objects => {
    exports.push(saveObjects(index, objects))
  })

  // await asyncForEach(objectChunks, objects => {
  //   exports.push(saveObjects(index, objects))
  // })

  await Promise.all(exports)
    .then(results => {
      console.info(`${chalk.green(
        '@netlify/plugin-algolia-index:'
      )} made ${chalk.cyan(results.length)} requests to Algolia`)
    })
    .catch(error => {
      throw error
    })
}

const saveObjects = (index, objects) => {
  return index
    .saveObjects(objects)
    .then(({ objectIDs }) => {
      objectIDs.forEach(objectID => {
        console.info(`${chalk.green(
          '@netlify/plugin-algolia-index:'
        )} indexing ${chalk.cyan(objectID + '/')}`)
      });
    })
    .catch(error => {
      throw error
    })
}

module.exports = {
  exporter
}
