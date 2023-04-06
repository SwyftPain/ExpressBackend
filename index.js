const app = require('express')();
const mysql = require( 'mysql' );
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
	res.json({ message: 'Hello World!' });
} );

app.use(
	cors({
		origin: 'https://www.swyftpain.co.uk',
	})
);

app.get('/api/getstats', (req, res) => {
	const connection = mysql.createPool({
		host: process.env.DBServer,
		user: process.env.DBUsername,
		password: process.env.DBPassword,
		database: process.env.DBName,
		connectTimeout: 30000,
        timeout: 30000,
        connectionLimit: 100,
	});

	connection.query('SELECT * FROM users ORDER BY date DESC', (err, rows) => {
		if (err) {
			console.error(err);
			return res.send(err);
		}
		return res.send(rows);
	});
});

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});

module.exports = app;
