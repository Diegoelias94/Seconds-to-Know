CREATE TABLE IF NOT EXISTS scores (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    score INTEGER NOT NULL,
    date TIMESTAMP NOT NULL
);

CREATE INDEX idx_username ON scores(username);
CREATE INDEX idx_date ON scores(date);
