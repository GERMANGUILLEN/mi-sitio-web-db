const express = require('express');
const { Pool } = require('pg');

const app = express();

console.log("DATABASE_URL:");
console.log(process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },

  connectionTimeoutMillis: 5000
});

app.use(express.static('public'));

app.get('/datos', async (req, res) => {

  try {

    const result =
      await pool.query('SELECT NOW()');

    res.json(result.rows);

  } catch (err) {

    console.error("ERROR POSTGRESQL:");
    console.error(err);

    res.status(500).send(err.message);
  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `Servidor corriendo en puerto ${PORT}`
  );

});