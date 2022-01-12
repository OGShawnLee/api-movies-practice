const { Router } = require('express');
const { hasProps, makeValid } = require('../utils');
const { getMovies, writeMovies } = require('../utils/internal');

const router = Router();

router
	.get('/', (req, res) => {
		const movies = getMovies();
		res.json(movies);
	})
	.get('/:id', ({ params }, res) => {
		const target = getMovies()[+params.id];
		if (target) res.status(200).json(target);
		else res.status(404).json('Not Found');
	})
	.put('/', (req, res) => {
		const body = req.body;
		const isValid = hasProps(body, 'title', 'director', 'year', 'rating');
		if (isValid) {
			const movies = getMovies();
			const duplicate = movies.find((movie) => {
				return movie.title.toLowerCase() === req.body.title.toLowerCase();
			});

			if (duplicate) return res.status(400).json('Duplicate');

			const newMovie = {
				id: movies.length,
				title: body.title,
				director: body.director,
				year: body.year,
				rating: body.rating,
			};

			movies.push(newMovie);
			writeMovies(movies);

			res.status(201).json(movies);
		} else res.status(400).send('Invalid Movie');
	})
	.delete('/:id', (req, res) => {
		const { id: raw } = req.params;
		const invalid = isNaN(String(raw));

		if (invalid) res.status(400);
		else {
			const movies = getMovies();
			const id = Number(raw);
			const exists = movies[id];

			if (exists) {
				movies.splice(id, 1);
				writeMovies(movies);
				res.status(200).json(movies);
			} else res.sendStatus(400);
		}
	})
	.put('/:id', ({ body, params }, res) => {
		const movies = getMovies();
		const isValidMovie = hasProps(body, 'title', 'director', 'year', 'rating');

		const id = +params.id;
		if (isValidMovie) {
			const duplicate = movies.find((item, index) => {
				const idMatch = id === index;
				return item.title.toLowerCase() === body.title.toLowerCase() && !idMatch;
			});

			if (duplicate) return res.status(400).json('Duplicate Title');

			const newMovie = (movies[id] = { id, ...body });
			writeMovies(movies);
			return res.status(201).json(newMovie);
		}

		res.status(400).json('Invalid Movie');
	})
	.post('/:id', ({ body, params }, res) => {
		const movies = getMovies();
		const target = movies[params.id];

		const validMovie = makeValid(body, 'title', 'director', 'year', 'rating');
		const newMovie = { ...target, ...validMovie };
		movies[params.id] = newMovie;

		writeMovies(movies);
		res.status(201).json(newMovie);
	});

module.exports = router;
