CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255),  -- Remove UNIQUE and make it nullable
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS scores (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    score INTEGER NOT NULL,
    date TIMESTAMP NOT NULL,
    game_mode VARCHAR(20) NOT NULL
);

CREATE INDEX idx_user_id ON scores(user_id);
CREATE INDEX idx_date ON scores(date);
