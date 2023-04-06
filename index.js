const app = require('express')();
const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 3000;

app.get('/api/getstats', (req, res) => {
	async function fetchData() {
		try {
			const connection = mysql.createConnection({
				host: process.env.DBServer,
				user: process.env.DBUsername,
				password: process.env.DBPassword,
				database: process.env.DBName,
				connectTimeout: 30000,
				timeout: 30000,
			});

			const rows = connection.query(
				'SELECT * FROM users ORDER BY date DESC',
				(err, rows) => {
					if (err) {
						console.error(err);
						return res.send(err);
					}
					return res.send(rows);
				}
			);
		} catch (error) {
			console.error(error);
			return res.send(error);
		}
	}
	fetchData();
});

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});

module.exports = app;
