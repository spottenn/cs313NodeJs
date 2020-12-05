const express = require('express')
const path = require('path')
const {Pool} = require('pg');
const bodyParser = require('body-parser');
const mailCost = require('./mailCost');
const handleToxicity = require('./handleToxicity');
const dbHelper = require('./dbHelper');
const loginHandler = require('./loginHandler');

const PORT = process.env.PORT || 5000




express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .use(logRequest)
    .use(bodyParser.urlencoded({extended: true}))
    .get('/', (req, res) => {
        dbHelper.getExamples((examples) => {
            res.render('pages/index', {textBlocks: examples, userText: false});
        })
    })
    .post('/signIn', loginHandler.signIn)
    .get('/getRate', mailCost.calculateRate)
    .get('/getRateJson', mailCost.calculateRate)
    .get('/getGuessesDiv', handleToxicity.getGuessesDiv)
    .get('/quickInsert', () => { dbHelper.insertUser(39949)})
    .post('/saveBlock', loginHandler.verifySignedIn, dbHelper.saveBlock)
    .post('/quickSaveBlock',  dbHelper.saveBlock)
    .post('/deleteBlock', loginHandler.verifySignedIn, dbHelper.deleteBlock)
    .listen(PORT, () => console.log(`Listening on ${PORT}`))



function sendTextBlocks(req, res, next) {

}
function logRequest(req, res, next) {
    console.log("Received a request for: " + req.url);
    next();
}