const express = require('express')
const router = express.Router()
const mysql = require( 'mysql' )
const dotenv = require( 'dotenv' )
dotenv.config()

/* GET users listing. */
router.get('/', function (req, res, next) {
  async function fetchData () {
    try {
      const connection = mysql.createConnection({
        host: process.env.DBServer,
        user: process.env.DBUsername,
        password: process.env.DBPassword,
        database: process.env.DBName,
        connectTimeout: 30000,
        timeout: 30000
      } )

      const rows = connection.query('SELECT * FROM users ORDER BY date DESC', (err, rows) => {
        if (err) {
          console.error(err)
          return res.send(err)
        }
        return res.send(rows)
      })
    } catch (error) {
      console.error(error)
      return res.send(error)
    }
  }
  fetchData()
})

module.exports = router
