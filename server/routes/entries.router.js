const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// get route params with "/route/:paramName, then reference it as req.params.paramName"
router.get('/', (req, res) => {
  const queryText = `SELECT "entries".*,
	"projects"."name" as "project_name" 
  FROM "entries" JOIN "projects" ON "entries"."project_id" = "projects"."id"
  ORDER BY "entries"."id" ASC;`;
  pool.query(queryText)
    .then(results => res.send(results.rows))
    .catch(error => {
      console.log('Error getting all from "entries" table:', error);
      res.sendStatus(500);
    });
});

router.post('/', (req, res) => {
  const entryToAdd = req.body; // This the data we sent
  console.log('/entries POST hit:', entryToAdd); // Has a name, size and cost
  
  const queryText = `INSERT INTO "entries" 
    ("text", "project_id", "entry_date", "start_time", "end_time") 
    VALUES ($1, $2, $3, $4, $5);`;
  
  pool.query(queryText, [
    entryToAdd.text, 
    entryToAdd.project_id, 
    entryToAdd.entry_date, 
    entryToAdd.start_time, 
    entryToAdd.end_time
  ]).then(() => res.sendStatus(201))
  .catch(error => {
    console.log('Error in POST:', error);
    res.sendStatus(500);
  });
});

router.put('/:id', (req, res) => {
  const entryId = req.params.id;
  const updatedEntry = req.body;
  console.log(`/entries/${entryId} PUT hit:`, updatedEntry);
  
  const queryText = `UPDATE "entries"
    SET "text" = $2, "project_id" = $3, "entry_date" = $4
    WHERE "id" = $1;`;

  pool.query(queryText, [
    entryId, 
    updatedEntry.text, 
    updatedEntry.project_id, 
    updatedEntry.entry_date
  ]).then(result => {
      console.log(`/entries/${entryId} PUT success:`, result);
      res.sendStatus(200);
  }).catch(error => {
    console.log(`/entries/${entryId} PUT error:`, error);
  });
});

router.delete('/:id', (req, res) => {
  const entryId = req.params.id;
  console.log(`/entries/${entryId} DELETE hit`);

  const queryText = 'DELETE FROM "entries" WHERE "id" = $1;';
  pool.query(queryText, [entryId]).then(result => {
    console.log(`/entries/${entryId} DELETE success:`, result);
    res.sendStatus(202);
  }).catch(error => {
    console.log(`/entries/${entryId} DELETE error:`, error);
    res.sendStatus(500);
  });
});

router.delete('/project/:id', (req, res) => {
  const projectId = req.params.id;
  console.log(`/entries/project/${projectId} DELETE hit`);
  
  const queryText = `DELETE FROM "entries" WHERE "project_id" = $1`;
  pool.query(queryText, [projectId]).then(result => {
    console.log(`/entries/project/${projectId} DELETE success:`, result);
    res.sendStatus(202);
  }).catch(error => {
    console.log(`/entries/project/${projectId} DELETE error:`, error);
    res.sendStatus(500);
  });
});

module.exports = router;