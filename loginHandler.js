const {OAuth2Client} = require('google-auth-library');
const dbHelper = require('./dbHelper');
const bodyParser = require('body-parser');
const session = require('express-session');



const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const client = new OAuth2Client(CLIENT_ID);

async function verifyToken() {

}

exports.signIn = async (req, res) => {
    const ticket = awaitclient.verifyIdToken({
        idToken: req.body.idToken,
        audience: CLIENT_ID
    });
    const googleUserId = ticket.getPayload()['sub'];
    dbHelper.insertUser(googleUserId);
    res.json({success: true});
}