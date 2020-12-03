CREATE TABLE users
(
    id       SERIAL       NOT NULL PRIMARY KEY,
    google_user_id VARCHAR(100) NOT NULL UNIQUE CHECK (google_user_id <> '')
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

INSERT INTO example_text_blocks (name, text) VALUES ('Example 1', 'You stink');

ALTER TABLE example_text_blocks RENAME COLUMN name TO title;