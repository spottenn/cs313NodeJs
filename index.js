const express = require('express')
const path = require('path')
const {Pool} = require('pg');
const mailCost = require('./mailCost');
const handleToxicity = require('./handleToxicity');
const dbHelper = require('./dbHelper')


const PORT = process.env.PORT || 5000



express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => {
        dbHelper.getExamples((examples) => {
            res.render('pages/index', {textBlocks: examples, userText: false});
        })
    })
    .get('/getRate', mailCost.calculateRate)
    .get('/getRateJson', mailCost.calculateRate)
    .get('/getGuessesDiv', handleToxicity.getGuessesDiv)
    .listen(PORT, () => console.log(`Listening on ${PORT}`))



