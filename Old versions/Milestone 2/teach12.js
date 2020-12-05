const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');
const session = require('express-session');
const {Pool} = require('pg');
const PORT = process.env.PORT || 5000;
const bcrypt = require('bcrypt');
const saltRounds = 10;


const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

// bcrypt.hash('password', saltRounds, function(err, hash) {
//     if (err) {
//         console.log(err);
//     }
//     pool.query('INSERT INTO teach_12_users (username, passwordHash) VALUES ($1, $2)', ['admin', hash], function (err, result) {
//         if (err) {
//             console.log(err);
//         }
//     });
// });

express()
    .use(express.static(path.join(__dirname, 'public')))
    .use(session({
        secret: 'team4teach12',
        resave: false,
        saveUninitialized: true
    }))
    .use(bodyParser.urlencoded({extended: true}))
    .use(logRequest)
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .post('/login', login)
    .post('/logout', logout)
    .use("/getServerTime", verifyLogin)
    .get('/getServerTime', getServerTime)
    .listen(PORT, () => console.log(`Listening on ${PORT}`))


function login(req, res) {
    let sql = "SELECT passwordHash FROM teach_12_users WHERE username = $1";
    let values = [req.body.username];
    pool.query(sql, values, function (err, result) {
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
        console.log("Query result:");
        console.log(result);
        verifyPassword(req.body.password, result.rows[0].passwordhash, (err, result) => {
            console.log("Password verify result:");
            console.log(result);
            if (result) {
                req.session.username = 'admin';
                res.json({success: true});
            } else {
                res.json({success: false});
            }
        });
    });

}

function verifyPassword(plainTextPassword, passwordHash, callback) {
    console.log("input plain text password:");
    console.log(plainTextPassword);
    console.log("hash:");
    console.log(passwordHash);
    bcrypt.compare(plainTextPassword, passwordHash, callback);
}

function logout(req, res) {
    if (req.session.username) {

        req.session.destroy();
        res.json({success: true});
    } else {
        res.json({success: false});
    }
}
function getServerTime(req, res) {
    let time = new Date();
    let responseData = {
        success: true,
        time: time
    }
    res.json(responseData);
}

function logRequest(req, res, next) {
    console.log("Received a request for: " + req.url);
    next();
}

function verifyLogin(req, res, next) {
    if (req.session.username) {
        next();
    } else {
        res.status(401);
        res.json({ error: "You're not logged in" });
    }
}
