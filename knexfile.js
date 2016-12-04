
module.exports = {

    test: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        seeds: {directory: './seeds/test'}
    },
};
