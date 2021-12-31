const {Query} = require('mongoose')
const redisClient = require("../services/redis");


function formatCacheKey(query) {
    return JSON.stringify(
        Object.assign(
            {collection: query.mongooseCollection.name},
            query.getQuery()
        )
    )
}

const exec = Query.prototype.exec;
Query.prototype.exec = async function(){

    const queryCacheKey = formatCacheKey(this)

    const cacheValue = await redisClient.get(queryCacheKey)

    if (cacheValue) {
        const doc = JSON.parse(cacheValue)

        return Array.isArray(doc)
            ? doc.map(d => this.model(d))
            : this.model(doc)
    }

    const result = await exec.apply(this,arguments)

    await redisClient.set(queryCacheKey,JSON.stringify(result))

    return result
}
