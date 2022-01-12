function hasProps(val, ...properties) {
	const unique = Array.from(new Set(properties));
	return unique.every((prop) => prop in val);
}

function onlyProps(val, ...properties) {
	const props = Object.keys(val);
	return props.length === properties.length && hasProps(val, ...properties);
}

function makeValid(val, ...properties) {
	return properties.reduce((obj, prop) => {
		if (prop in val) obj[prop] = val[prop];
		return obj;
	}, {});
}

module.exports = { hasProps, makeValid, onlyProps };
