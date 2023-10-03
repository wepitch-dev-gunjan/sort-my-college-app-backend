const express = require('express');
const app = express();
require('dotenv').config();
const { readdirSync } = require('fs')
const cors = require('cors');

const { PORT } = process.env;

app.use(express.json());
app.use(cors())

readdirSync('./routes').map(r => app.use('/', require('./routes/' + r)))

app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
})
