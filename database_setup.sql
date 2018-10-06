-- table to store projects
CREATE TABLE projects(
	id SERIAL PRIMARY KEY,
	name VARCHAR(100)
);
INSERT INTO projects ("name") VALUES ('Project 1'), ('Project 2');

-- table for time entries for a specific project
CREATE TABLE entries (
	id SERIAL PRIMARY KEY,
	text VARCHAR(255),
	project_id integer REFERENCES projects,
	entry_date bigint,
	start_time bigint,
	end_time bigint
);

-- insert some sample entries into the database
INSERT INTO entries ("text", "project_id", "entry_date", "start_time", "end_time") VALUES 
('entry 1', '1', 1533736800000, 1533736800000, 1533740400000),
('entry 2', '1', 1533736800000, 1533736800000, 1533745800000),
('entry 3', '2', 1536501600000, 1536501600000, 1536508800000);