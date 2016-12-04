import knex from 'knex';
import mockKnex from 'mock-knex';

const mockConnection = () => {
    const connection = knex({client: 'pg', debug: false});
    mockKnex.mock(connection);
    return connection;
}

const realConnection = () => knex({
    client: 'pg',
    connection: process.env.DATABASE_URL
});

const connection = process.env.NODE_ENV === 'unit' ? mockConnection() : realConnection();

export default connection;
