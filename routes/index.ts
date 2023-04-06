import express, { Request, Response } from 'express'
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ title: 'GeoGuessr Stats' })
})

export default router
