const {createClient} = require('redis');

const client = createClient({
    host:'localhost',
    port: 6379
})

client.connect()

const clearHash = function (hashKey){
    return client.del(
        JSON.stringify(hashKey)
    )
}

module.exports = {
    client,
    clearHash
}
