const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// get route params with "/route/:paramName, then reference it as req.params.paramName"
router.get('/', (req, res) => {
  const queryText = `SELECT "entries".*,
	to_char("entries"."entry_date", 'MM/DD/YY') AS "entry_date",
	"projects"."name" as "project_name", 
	DATE_PART('hour', "entries"."end_time"::time - "entries"."start_time"::time) + 
	DATE_PART('MINUTE', "entries"."end_time"::time - "entries"."start_time"::time) / 60 AS "hours" 
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
  // POSTGRESQL SAMPLE PUT
  //  const updatedShoe = req.body;
  //  const queryText = `UPDATE "shoes" 
  //                     SET "name" = $1, "cost" = $2, "size" = $3
  //                     WHERE "id" = $4;`;
  //  pool.query(queryText, [updatedShoe.name,
  //                         updatedShoe.cost, 
  //                         updatedShoe.size, 
  //                         updatedShoe.id]).then( (result) => {
  //                             res.sendStatus(200);
  //                         }).catch( (error) => {
  //                             res.sendStatus(500);
  //                         });
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