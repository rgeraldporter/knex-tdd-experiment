
exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTableIfNotExists('things', function(table) {
			table.increments();
			table.string('value', 25).notNull();
		})
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.dropTable('things')
	]);
};
