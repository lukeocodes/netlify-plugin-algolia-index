const {
  ALGOLIA_APPLICATION_ID: algoliaAppId,
  AlGOLIA_ADMIN_KEY: algoliaAdminKey,
  ALGOLIA_INDEX: algoliaIndex
} = process.env

const algoliasearch = require("algoliasearch")
const client = algoliasearch(algoliaAppId, algoliaAdminKey)
const index = client.initIndex(algoliaIndex)

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

const exporter = async (searchIndex) => {
  const chunks = chunk(searchIndex, 50)

  console.info('Exporting the following pages to the index')
  await asyncForEach(chunks, async chunk => {
    await index
      .saveObjects(chunk)
      .then(({ objectIDs }) => {
        console.info(objectIDs)
      })
      .catch(err => {
        console.error(err)
      })
  })
}

module.exports = {
  exporter
}
