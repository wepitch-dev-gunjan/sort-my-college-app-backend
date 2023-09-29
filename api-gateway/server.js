const gateway = require('fast-gateway')
require('dotenv').config();

const { PORT, USER_PORT, COUNSELLOR_PORT, ENTRANCE_PREPARATIONS_PORT, VOCATIONAL_COURSES_PORT, WEBINARS_PORT } = process.env;
const server = gateway({
  routes: [
    {
      prefix: '/user',
      target: `http://127.0.0.1:${USER_PORT}`
    },
    {
      prefix: '/counsellor',
      target: `http://127.0.0.1:${COUNSELLOR_PORT}`
    },
    {
      prefix: '/ep',
      target: `http://127.0.0.1:${ENTRANCE_PREPARATIONS_PORT}`
    },
    {
      prefix: '/vc',
      target: `http://127.0.0.1:${VOCATIONAL_COURSES_PORT}`
    },
    {
      prefix: '/webinars',
      target: `http://127.0.0.1:${WEBINARS_PORT}`
    },
  ]
})

server.get('/', (req, res) => {
  res.send('welcome')
})

server.start(PORT).then(() => {
  console.log('server started at port: ' + PORT);
})
