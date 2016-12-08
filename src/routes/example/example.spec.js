import assert from 'assert';
import td from 'testdouble';
import exampleController from './example';
import mockDb from 'mock-knex';
import restify from 'restify';
import Promise from 'bluebird';

describe('The example controller', () => {
    let tracker, serverSpy, controller;

    beforeEach(() => {
        tracker = mockDb.getTracker();
        tracker.install();
        serverSpy = () => null;
        controller = exampleController(serverSpy);
    });

    afterEach(() => {
        tracker.uninstall();
    });

    describe('getThing', () => {
        let request, response, next;
        beforeEach(() => {
            request = {params: {id: 111}};
            response = { send: td.function() };
            next = td.function();
        });

        afterEach(() => {
            td.reset();
        });

        it('should get a valid thing', () => {
            tracker.on('query', query => {
                assert.equal(query.method, 'first');
                assert.equal(query.bindings[0], 111);
                query.response({value: 'some data'});
            });
            return controller.getThing(request, response, next)
                .then(() => {
                    // when the tracker.on fails, it actually flags as td.verify failure
                    // to invoke the method, so actual failure line is lost.
                    // the only way to catch these properly is to assert next(), but even then,
                    // the error isn't clean.
                    // (setting next() to return a promise does not help this)
                    td.verify(response.send(200, {value: 'some data'}));
                });
        });

        it('should not get a invalid thing', () => {
            request = {params: {id: 112}};
            tracker.on('query', query => {
                // when these fail they will be rather vague
                // seems to be due to 'Not found' error nullifying these assertion error messages
                assert.equal(query.method, 'first');
                assert.equal(query.bindings[0], 112);
                query.response([]);
            });
            return controller.getThing(request, response, next)
                .then(() => {
                    td.verify(next(new restify.NotFoundError('Not found')));
                });
        });
    });

    describe('postThing', () => {
        let request, response, next;
        beforeEach(() => {
            request = {body: {value: 'someData'}};
            response = {send: td.function()};
            next = td.function();
        });

        afterEach(() => {
            td.reset();
        });

        it('should return an error if thing is not included', () => {
            delete request.body.value;
            return controller.postThing(request, response, next)
                .then(() => {
                    td.verify(next(new restify.BadRequestError('No thing data was included')));
                });
            
        });

        // NON-FALSIFIABLE!
        xit('should have postgres call the INSERT query', () => {
            let error = false;
            tracker.on('query', query => {
                assert.equal(query.method, 'insert');
                assert.ok(query.sql.indexOf('insert int o "things"') !== -1);
                assert.equal(query.bindings[0], 'someData');
                query.response([110]);
            });
            return controller.postThing(request, response, next);
        });

        // must use done() with try/catch, and even then, error is vague
        it('should have postgres call the INSERT query', done => {
            let error = false;
            tracker.on('query', query => {
                try {
                    assert.equal(query.method, 'insert');
                    assert.ok(query.sql.indexOf('insert into "things"') !== -1);
                    assert.equal(query.bindings[0], 'someData');
                    done();
                }
                catch (err) {
                    done(err);
                }
            });
            controller.postThing(request, response, next);
        });

        it('should return a 201 code on success', () => {
            tracker.on('query', query => {
                query.response([112]);
            });
            return controller.postThing(request, response, next).then(() => {
                td.verify(response.send(201, {id: 112}));
            });
        });

    });

});