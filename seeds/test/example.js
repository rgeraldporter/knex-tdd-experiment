
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('things').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('things').insert({id: 111, value: 'data'})
      ]);
    });
};
