const { writeFile } = require('fs');

function getMovies() {
	return require('../db/index.json');
}

function writeMovies(data) {
	const validData = JSON.stringify(data);
	writeFile('src/db/index.json', validData, (err) => {
		if (err) throw err;
	});
}

module.exports = { getMovies, writeMovies };
