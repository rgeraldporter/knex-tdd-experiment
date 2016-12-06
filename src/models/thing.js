import db from '../lib/db';

let get = str => db('things')
    .first('*')
    .where('id', str)
    .then(thing => thing ? thing : null);

const post = val => db('things')
    .insert(val)
    .returning('id');

export default {get, post};
