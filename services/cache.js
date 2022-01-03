const {Query} = require('mongoose')
const {client} = require("../services/redis");


function formatCacheKey(query) {
    return JSON.stringify(
        Object.assign(
            {collection: query.mongooseCollection.name},
            query.getQuery()
        )
    )
}

Query.prototype.cache = function (options = {}){
    this.shouldCache = true;
    this.hashKey = JSON.stringify(options.key || '')

    return this;
}

const exec = Query.prototype.exec;
Query.prototype.exec = async function(){

    if(!this.shouldCache){
        return exec.apply(this,arguments);
    }

    const queryCacheKey = formatCacheKey(this)

    const cacheValue = await client.hGet(this.hashKey, queryCacheKey)

    if (cacheValue) {
        const doc = JSON.parse(cacheValue)

        return Array.isArray(doc)
            ? doc.map(d => this.model(d))
            : this.model(doc)
    }

    const result = await exec.apply(this,arguments)

    await client.hSet(this.hashKey, queryCacheKey,JSON.stringify(result),{EX: 60})

    return result
}
