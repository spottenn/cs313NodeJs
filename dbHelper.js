const {Pool} = require('pg');
const loginHandler = require('./loginHandler');


const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});
const getExamplesSql = "SELECT id, title, text FROM example_text_blocks";
const getTextBlocksSql = "SELECT id, title, text FROM text_blocks WHERE user_id = (SELECT id FROM users WHERE google_user_id = $1)";

exports.getExamples = (callback) => {
    pool.query(getExamplesSql, function (err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }

        // Log this to the console for debugging purposes.
        // console.log("Back from DB with result:");
        // console.log(result.rows);
        callback(result.rows);
    });
}


exports.insertUser = (googleUserId) => {
    const getUserIdSql = "SELECT id FROM users WHERE google_user_id = $1";
    const insertUserIdSql = "INSERT INTO users (google_user_id) VALUES ($1)";
    const params = [googleUserId];
    console.log("insertUserMethod");
    //console.log(params);
    const insertUserQuery = () => {
        pool.query(insertUserIdSql, params, function (err, result) {
            if (err) {
                console.log("Error in query: ")
                console.log(err);
            }
        })
    }
    pool.query(getUserIdSql, params, (err, result) => {
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
        console.log("getUser result:");
        //console.log(result);
        if (result.rows && result.rows.length === 0) {
            insertUserQuery();
        } else {
            //user already exists
        }
    });
}
exports.saveBlock = async (req, res) => {
    const insertBlockSql =
        "INSERT INTO text_blocks (user_id, title, text) values ((SELECT id FROM users WHERE google_user_id = $1),$2, $3)"
    const params = [await loginHandler.getGoogleUserId(req.body.idToken), req.body.title, req.body.textBlock]
    console.log("saveBlockParams");
    //console.log(params);
    pool.query(insertBlockSql, params, function (err, result) {
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
    })
}

exports.getUserBlocks = (googleUserId, callback) => {
    pool.query(getTextBlocksSql, [googleUserId], function (err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }

        // Log this to the console for debugging purposes.
        // console.log("Back from DB with result:");
        // console.log(result.rows);
        if (result.rows) {
            callback(result.rows);
        } else {
            callback(undefined);
        }
    });
}