const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// get route params with "/route/:paramName, then reference it as req.params.paramName"
router.get('/', (req, res) => {
  console.log('/projects GET hit');
  const queryText = 
  `SELECT "projects".*,
	COALESCE(
		SUM(("entries"."end_time" - "entries"."start_time")::float / 1000 / 60 / 60)
	, 0)
	AS "total_hours"
	FROM "projects" 
	LEFT JOIN "entries" ON "projects"."id" = "entries"."project_id" 
	GROUP BY "projects"."id" ORDER BY "projects"."id";`;
    
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
  const projectId = req.params.id;
  const propsToUpdate = req.body;
  console.log(`/projects/${projectId} PUT hit:`, propsToUpdate);
  
  const queryText = `UPDATE "projects" SET "name" = $2 WHERE "id" = $1;`;
  
  pool.query(queryText, [projectId, propsToUpdate.name])
    .then(result => {
      console.log(`/projects/${projectId} PUT success:`, result);
      res.sendStatus(200);
    }).catch(error => {
      console.log(`/projects/${projectId} PUT error:`, error);
      res.sendStatus(500);
    });
});

router.delete('/:id', (req, res) => {
  const projectId = req.params.id;
  console.log(`/projects/${projectId} DELETE hit`);

  const queryText = 'DELETE FROM "projects" WHERE "id" = $1;';
  pool.query(queryText, [projectId]).then(result => {
    console.log(`/projects/${projectId} DELETE success:`, result);
    res.sendStatus(200);
  }).catch(error => {
    console.log(`/projects/${projectId} DELETE error:`, error);
    res.sendStatus(500);
  });
});

module.exports = router;