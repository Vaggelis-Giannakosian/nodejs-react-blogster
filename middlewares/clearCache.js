const {clearKey} = require('../services/redis')

module.exports = (req,res,next) => {
    clearKey(req.user.id)

    return next();
}
