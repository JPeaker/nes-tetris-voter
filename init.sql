CREATE TABLE boards (
	ID SERIAL PRIMARY KEY,
	CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	LAST_UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	BOARD INTEGER[][] NOT NULL
)
