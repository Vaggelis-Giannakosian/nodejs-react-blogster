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

Query.prototype.cache = function (){
    this.shouldCache = true;
    return this;
}

const exec = Query.prototype.exec;
Query.prototype.exec = async function(){

    if(!this.shouldCache){
        return exec.apply(this,arguments);
    }

    const queryCacheKey = formatCacheKey(this)

    const cacheValue = await redisClient.get(queryCacheKey)

    if (cacheValue) {
        const doc = JSON.parse(cacheValue)

        return Array.isArray(doc)
            ? doc.map(d => this.model(d))
            : this.model(doc)
    }

    const result = await exec.apply(this,arguments)

    await redisClient.set(queryCacheKey,JSON.stringify(result),{EX: 60})

    return result
}
