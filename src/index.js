const express = require('express');
const morgan = require('morgan');

const app = express();
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 4);

// middleware
app.use(
	morgan('dev'),
	express.json(),
	express.urlencoded({ extended: false }),
	require('./routes')
);

app.use('/api/movies', require('./routes/movies'));

app.listen(app.get('port'), () => {
	console.log(`Server ${app.get('port')}`);
});
