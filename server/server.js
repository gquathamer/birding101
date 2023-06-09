const express = require('express');
const pg = require('pg');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const db = new pg.Pool({
  host: 'localhost',
  database: 'ebird',
  user: 'postgres',
  password: 'password',
  port: '5432'
})

const app = express();
const config = require('../webpack.config.js');
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
}));

app.use(require("webpack-hot-middleware")(compiler));

app.use(express.json());

app.get('/api/test', (req, res) => {
  const sql = `
    SELECT *
    FROM "ebird-species"
    LIMIT 10
  `;
  db.query(sql)
    .then(dbResponse => {
      res.status(200).json(dbResponse.rows);
    })
    .catch(err => console.error(err))
});

app.post('/api/species', (req, res) => {
  let { species } = req.body;
  species = species.charAt(0).toUpperCase() + species.slice(1);
  const params = [species];
  const sql = `
    SELECT "SPECIES_CODE","PRIMARY_COM_NAME"
    FROM "ebird-species"
    WHERE "PRIMARY_COM_NAME" LIKE '%'||($1)||'%'
    LIMIT 10
  `;
  db.query(sql, params)
    .then(dbResponse => {
      res.status(200).json(dbResponse.rows);
    })
    .catch(err => console.error(err));
})

app.listen(3000, () => {
  process.stdout.write(`\n\napp listening on port ${3000}\n\n`);
});
