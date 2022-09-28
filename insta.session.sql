CREATE TABLE post (
    id BIGSERIAL PRIMARY KEY,
    author_id BIGINT REFERENCES users (id) NOT NULL,
    owner_id BIGINT REFERENCES users (id) NOT NULL,
    post_text VARCHAR(200),
    post_image VARCHAR(200),
    time_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
)