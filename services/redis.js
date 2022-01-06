const {createClient} = require('redis');
const keys = require('../config/keys')

const client = createClient({
    host: keys.redis.host,
    port: keys.redis.port
})

client.connect()

const clearKey = function (hashKey){
    return client.del(
        JSON.stringify(hashKey)
    )
}

module.exports = {
    client,
    clearKey
}
