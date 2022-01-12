const { hasProps, makeValid, onlyProps } = require('./object');

describe('hasProps', () => {
	it('Should return true if all the properties exist', () => {
		const obj = { first: 1, second: 2 };
		const valid = hasProps(obj, 'first', 'second');
		expect(valid).toBe(true);
	});

	it('should return false if a property is not found', () => {
		const obj = { first: 1, second: 2 };
		const valid = hasProps(obj, 'first', 'second', 'third');
		expect(valid).toBe(false);
	});

	it('should return true if a set of properties are found', () => {
		const deep = {
			name: 'James',
			last: 'Smith',
			age: 23,
			country: 'United State',
		};

		const valid = hasProps(deep, 'name', 'country');
		expect(valid).toBe(true);
	});

	it('should work with repeated properties', () => {
		const obj = { first: 'One' };
		const valid = hasProps(obj, 'first', 'first', 'first');
		expect(valid).toBe(true);
	});
});

describe('onlyProps', () => {
	it('should return false if there are additional properties', () => {
		const obj = { first: 1, second: 2, additional: 'I should not be here' };
		const valid = onlyProps(obj, 'first', 'second');
		expect(valid).toBe(false);
	});

	it('should return true if the object only has the given properties', () => {
		const obj = { first: 1, second: 2 };
		const valid = onlyProps(obj, 'first', 'second');
		expect(valid).toBe(true);
	});
});

describe('makeValid', () => {
	const obj = { name: 'James', lastName: 'Smith', extra: 'Invalid' };
	test('should return a valid object (not null)', () => {
		const validObj = makeValid(obj, 'name', 'lastName');
		expect(validObj).not.toBeFalsy();
		expect(validObj).toBeInstanceOf(Object);
	});

	test('should not mutate the original object', () => {
		let validObj = makeValid(obj, 'name', 'lastName');
		expect(validObj).not.toBe(obj);
	});

	test('should work with empty string properties', () => {
		const obj = { '': 'Empty', extra: 'Extra' };
		let validObj = makeValid(obj, '', '', '', '');
		expect(validObj).not.toHaveProperty('extra');
	});

	test('should return an object with the invalid properties removed', () => {
		const obj = { name: 'James', lastName: 'Smith', extra: 'Invalid' };
		const validObj = makeValid(obj, 'name', 'lastName');

		expect(validObj).not.toHaveProperty('extra');

		const invalid = { first: 1, second: 2, third: 3 };
		const valid = makeValid(invalid, 'first');

		expect(valid).toEqual({ first: 1 });
	});

	test('should return an empty object if the object does not have any matching property', () => {
		const obj = { age: 5, first: 1, nested: { time: 45 } };
		const empty = makeValid(obj, 'name');
		expect(empty).toEqual({});
	});

	test('should work with different properties data types', () => {
		const mixedKeys = {
			str: 'String',
			69: 'Sixty Nine',
			bool: 'Boolean',
			arr: 42,
		};

		const valid = makeValid(mixedKeys, 69);
		expect(valid).not.toHaveProperty('str', 'bool');
	});
});
