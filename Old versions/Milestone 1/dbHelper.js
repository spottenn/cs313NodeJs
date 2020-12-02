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