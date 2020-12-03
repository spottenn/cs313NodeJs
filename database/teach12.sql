CREATE TABLE teach_12_users
(
    id       SERIAL       NOT NULL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE CHECK (username <> ''),
    passwordHash VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO teach_12_users (username, passwordHash) VALUES ('admin', 'password');