import restify from 'restify';
import example from '../routes/example/example';

const server = restify.createServer({name: 'Knex TDD Tutorial'});
const exampleController = example(server);

server.use(restify.bodyParser());

server.get({
    name: 'example-endpoint',
    path: '/example/:id',
    version: '1.0.0'
}, exampleController.getThing);

server.post({
    path: '/example',
    version: '1.0.0'
}, exampleController.postThing);

export default server;
