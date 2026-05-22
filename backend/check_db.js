const { Client } = require('pg');

async function test() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '1',
    port: 5432,
  });
  await client.connect();
  const res = await client.query('SELECT upper_clothing_type, chronic_conditions, tattoo_location FROM afet.victims ORDER BY created_at DESC LIMIT 1');
  console.log(res.rows[0]);
  await client.end();
}

test();
