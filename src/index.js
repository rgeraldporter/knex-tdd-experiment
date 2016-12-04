import restify from 'restify';
import exampleController from './routes/example/example';

const server = restify.createServer({name: 'Knex TDD Tutorial'});

server.get({
    name: 'example-endpoint',
    path: '/example/:id',
    version: '1.0.0'
}, exampleController.getThing);

export default server;
