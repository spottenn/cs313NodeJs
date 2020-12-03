const {Pool} = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});
const getExamplesSql = "SELECT id, title, text FROM example_text_blocks";

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
    console.log("about to insert");
    console.log(params);
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
        console.log(result);
        if (result.rows && result.rows.length === 0) {
            insertUserQuery();
        } else {
            //user already exists
        }
    });
}
