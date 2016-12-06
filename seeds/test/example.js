
exports.seed = function(knex, Promise) {
  return knex('things').del()
    .then(function () {
      return Promise.all([
        knex('things').insert({id: 111, value: 'data'})
      ]);
    });
};
