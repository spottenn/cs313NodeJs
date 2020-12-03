const {OAuth2Client} = require('google-auth-library');
const dbHelper = require('./dbHelper');
const session = require('express-session');


const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const client = new OAuth2Client(CLIENT_ID);

exports.getGoogleUserId = async  (idToken) =>{
    const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: CLIENT_ID
    });
    return ticket.getPayload()['sub'];
}


exports.signIn = async (req, res) => {
    try {
        let googleUserId = await getGoogleUserId(req.body.idToken);
        dbHelper.insertUser(googleUserId);
        res.json({success: true});
    } catch (err) {
        console.log(err);
    }
}
exports.verifySignedIn = async (req, res, next) => {
    let googleUserId = await getGoogleUserId(req.body.idToken);
    next();
}