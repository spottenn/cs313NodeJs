CREATE TABLE users
(
    id       SERIAL       NOT NULL PRIMARY KEY,
    google_user_id VARCHAR(256) NOT NULL UNIQUE CHECK (google_user_id <> '')
);

CREATE TABLE text_blocks
(
    id      SERIAL  NOT NULL PRIMARY KEY,
    user_id INT     NOT NULL REFERENCES users (id),
    title    TEXT    NOT NULL,
    text    TEXT    NOT NULL
);
CREATE TABLE example_text_blocks
(
    id      SERIAL  NOT NULL PRIMARY KEY,
    title    TEXT    NOT NULL,
    text    TEXT    NOT NULL
);

INSERT INTO example_text_blocks (title, text) VALUES ('Example 1', 'You stink');

SELECT * FROM users;