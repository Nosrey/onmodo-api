const express = require('express')
require('dotenv').config()
require('./config/database')
const cors = require('cors')
const router = require('./routes/index.js')

const app = express()

app.use(cors())
app.use(express.json({ limit: '50mb' }));


app.use('/api', router)

// const port = process.env.PORT
// const host = process.env.HOST || '0.0.0.0'

app.listen(8080)