import knex from 'knex';

if (process.env.NODE_ENV !== 'integration') {
  console.error('Can only be run in an integration environment. Attempted to run with NODE_ENV=', process.env.NODE_ENV);
  process.exit(1);
}

const pgConnection = knex({client: 'pg', connection: process.env.DATABASE_URL});

pgConnection.raw('DROP DATABASE example')
  .then(() => {
      return pgConnection.raw('CREATE DATABASE example');
  })
  .catch(err => {
      if ( err.message.indexOf('being accessed by other users') !== -1 ) {
          console.error('[KNEX-TUTORIAL] "example" is being accessed by another user and cannot be deleted. Perhaps you have it open in a desktop client?');
          process.exit(1);
      }
      console.log('[KNEX-TUTORIAL] DB did not exist, continuing...');
      return pgConnection.raw('CREATE DATABASE example');
  })
  .then(() => {
      pgConnection.destroy();
      console.log('[KNEX-TUTORIAL] Created example DB!');
  })
  .catch(err => {
      pgConnection.destroy();
      console.error('[KNEX-TUTORIAL] Something went wrong: ', err);
  });
