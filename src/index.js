import restify from 'restify';
import example from './routes/example/example';

const server = restify.createServer({name: 'Knex TDD Tutorial'});
const exampleController = example(server);

server.get({
    name: 'example-endpoint',
    path: '/example/:id',
    version: '1.0.0'
}, exampleController.getThing);

server.listen(8813, () => {
    const info = server.address();
    console.info(`Started server on ${info.address} ${info.port}`);
});
