# Knex TDD Experiments

The purpose of this repo is to experiment with Test-Driven Development (TDD) using [Restify](https://www.npmjs.com/package/restify), [Knex](https://www.npmjs.com/package/knex) and [Mock-Knex](https://www.npmjs.com/package/mock-knex) as cornerstones of working with an SQL DB system. The code used herein is specific to PostgreSQL, but minor adjustments could be made to enable usage with MySQL and other database systems compatible with Knex.

## Problem statement

Using Knex for schema-building can be an amazing tool for tracking changes to database tables and schemas in Node.js. It is also a great tool for setup & teardown in integration tests, but lacks tools for proper mocking of unit tests. This is where Mock-Knex comes in.

Mock-Knex provides functions for assertion libraries to use in unit tests. However, it is unnervingly easy to create non-falsifiable tests unless specific patterns are followed when using [Mocha](https://www.npmjs.com/package/mocha) and [Chai](https://www.npmjs.com/package/chai) as the testing framework and assertion library. 

The purpose of this experiment is to identify good patterns for use in this combination of libraries, and to explore alternatives that are less brittle.

## Cases

Each test case is in a seperate `hypothesis/*` branch depending on the framework(s) being used to test with.