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

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const exporter = async (index, newIndex) => {
  const indexChunks = chunk(newIndex, 50)

  await asyncForEach(indexChunks, async chunk => {
    await index
      .saveObjects(chunk)
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
  })
}

module.exports = {
  exporter
}
