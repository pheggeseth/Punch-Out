const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// get route params with "/route/:paramName, then reference it as req.params.paramName"
router.get('/', (req, res) => {
  console.log('/projects GET hit');
  const queryText = `SELECT "projects".*, 
	SUM(DATE_PART('hour', "entries"."end_time"::time - "entries"."start_time"::time) + 
		DATE_PART('MINUTE', "entries"."end_time"::time - "entries"."start_time"::time) / 60) 
		AS "total_hours" 
	FROM "projects" LEFT JOIN "entries" ON "projects"."id" = "entries"."project_id" GROUP BY "projects"."id" ORDER BY "projects"."id";`;
  pool.query(queryText)
    .then(results => res.send(results.rows))
    .catch(error => {
      console.log('DB Query Error:', error);
      res.sendStatus(500);
    });
});

router.post('/', (req, res) => {
  const newProject = req.body;
  console.log('/projects POST hit:', newProject);
  const query = 'INSERT INTO "projects" ("name") VALUES ($1);';
  pool.query(query, [newProject.name])
    .then(() => {
      console.log('"projects" table INSERT success');
      res.sendStatus(201);
    })
    .catch(error => {
      console.log('"projects" table INSERT error:', error);
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
  // POSTGRESQL SAMPLE DELETE
  // const idOfShoeToDelete = req.params.id;
  //   console.log('deleting ', idOfShoeToDelete);
  //   const queryText = 'DELETE FROM "shoes" WHERE "id" = $1;';
  //   pool.query(queryText, [idOfShoeToDelete]).then((result) => {
  //       res.sendStatus(200);
  //   }).catch( (error) => {
  //       console.log('Error in delete', error);
  //       res.sendStatus(500);
  //   });
});

module.exports = router;