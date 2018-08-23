-- POSTGRESQL DEV DATABASE SETUP
CREATE TABLE projects(
	id SERIAL PRIMARY KEY,
	name VARCHAR(100)
);

CREATE TABLE entries (
	id SERIAL PRIMARY KEY,
	text VARCHAR(255),
	project_id integer REFERENCES projects,
	entry_date date,
	start_time VARCHAR(10),
	end_time VARCHAR(10)
);

