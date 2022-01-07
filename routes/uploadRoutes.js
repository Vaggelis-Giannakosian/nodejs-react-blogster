const AWS = require('aws-sdk')
const keys = require('../config/keys')
const {v1} = require('uuid')
const requireLogin = require("../middlewares/requireLogin");

const s3 = new AWS.S3({
    accessKeyId: keys.s3.accessKeyId,
    secretAccessKey: keys.s3.secretAccessKey
})

module.exports = app => {
    app.get('/api/upload',requireLogin, async (req, res) => {

        const key = `${req.user.id}/${v1()}.jpeg`;

        const url = await s3.getSignedUrlPromise('putObject', {
            Bucket: 'my-bucket',
            ContentType: 'image/jpeg',
            Key: key
        })

        return res.status(200).send({key,url})
    })
}
