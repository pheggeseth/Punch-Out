// POSTGRESQL SETUP
const pg = require('pg');
const url = require('url');

let config = {};

if (process.env.DATABASE_URL) {
  // Heroku gives a url, not a connection object
  // https://github.com/brianc/node-pg-pool
  const params = url.parse(process.env.DATABASE_URL);
  const auth = params.auth.split(':');

  config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true, // heroku requires ssl to be true
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  };
} else {
  config = {
    host: 'localhost', // Server hosting the postgres database
    port: 5432, // env var: PGPORT
    database: 'time_tracker', // CHANGE THIS LINE! env var: PGDATABASE, this is likely the one thing you need to change to get up and running
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  };
}


const Pool = pg.Pool;
// const config = {
//   database: 'time_tracker', // name of database
//   host: 'localhost',
//   port: 5432,
//   max: 10, // max number of concurrent connections
//   idleTimeoutMillis: 10000 // attepmt to connect for 10 seconds
// };

const pool = new Pool(config);
pool.on('connect', () => console.log('postgresql connected!!!'));
pool.on('error', error => console.log('Error connecting to db', error));

module.exports = pool;