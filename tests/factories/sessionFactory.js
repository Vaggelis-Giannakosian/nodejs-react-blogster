const Keygrip = require('keygrip')
const {cookieKey} = require('../../config/keys')
const keygrip = new Keygrip([cookieKey])


module.exports = user => {

    const session = Buffer.from(
        JSON.stringify(
            {passport: {user: user._id.toString()}}
        )
    ).toString('base64')

    const sig = keygrip.sign('session=' + session)

    return {
        session,
        sig
    }
}



