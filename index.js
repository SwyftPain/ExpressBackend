const app = require('express')();
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

app.post('/api/addstats/:userid/:winorloss', (req, res) => {
	const userid = req.params.userid;
	const winorloss = req.params.winorloss;
	const time = new Date().getTime();

	if (winorloss === 'win') {
		connection.query(
			'UPDATE users SET wins = wins + 1, time = ? WHERE id = ?',
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
			'UPDATE users SET losses = losses + 1, time = ? WHERE id = ?',
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

app.post('/api/addnewstat/:discordId/:discordUsername', (req, res) => {
	const userid = req.params.discordId;
	const username = req.params.discordUsername;
	const time = new Date().getTime();

	connection.query(
		'INSERT INTO users (discordid, user, wins, time) VALUES (?, ?, 0, ?)',
		[userid, username, time],
		(err, rows) => {
			if (err) {
				console.error(err);
				return res.send(err);
			}
			return res.send(rows);
		}
	);
});

app.delete('/api/deletestats/:userid', (req, res) => {
	const userid = req.params.userid;

	connection.query(
		'DELETE FROM users WHERE discordid = ?',
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
