const app = require( 'express' )();
const express = require( 'express' );
const mysql = require('mysql');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
	res.json({ message: 'Hello World!' });
});

app.use(
	cors({
		// allow all
		origin: '*',
	})
);

app.use(express.json());

const connection = mysql.createPool({
	host: process.env.DBServer,
	user: process.env.DBUsername,
	password: process.env.DBPassword,
	database: process.env.DBName,
	connectTimeout: 30000,
	timeout: 30000,
	connectionLimit: 60000,
	queueLimit: 60000,
	waitForConnections: true,
	acquireTimeout: 30000,
});

app.get('/api/getstats', (req, res) => {
	connection.query('SELECT * FROM users ORDER BY date DESC', (err, rows) => {
		if (err) {
			console.error(err);
			return res.send(err);
		}
		return res.send(rows);
	});
});

app.post('/api/addstats', (req, res) => {
	const { userid, winorloss } = req.body;
	const time = new Date().getTime();

	if (winorloss === 'win') {
		connection.query(
			'UPDATE users SET wins = wins + 1, date = ? WHERE id = ?',
			[time, userid],
			(err, rows) => {
				if (err) {
					console.error(err);
					return res.send(err);
				}
				return res.send(rows);
			}
		);
	} else {
		connection.query(
			'UPDATE users SET losses = losses + 1, date = ? WHERE id = ?',
			[time, userid],
			(err, rows) => {
				if (err) {
					console.error(err);
					return res.send(err);
				}
				return res.send(rows);
			}
		);
	}
});

app.post('/api/addnewstat', (req, res) => {
	const { discordId, discordUsername } = req.body;
	const time = new Date().getTime();

	connection.query(
		'INSERT INTO users (discordid, user, date) VALUES (?, ?, ?)',
		[discordId, discordUsername, time],
		(err, rows) => {
			if (err) {
				console.log(req.body);
				console.error(err);
				return res.send(err);
			}
			console.log(req.body);
			return res.send(rows);
		}
	);
});

app.delete('/api/deletestats', (req, res) => {
	const userid = req.body.userid;

	connection.query(
		'DELETE FROM users WHERE id = ?',
		[userid],
		(err, rows) => {
			if (err) {
				console.error(err);
				return res.send(err);
			}
			return res.send(rows);
		}
	);
});

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});

module.exports = app;
