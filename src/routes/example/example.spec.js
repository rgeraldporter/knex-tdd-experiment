import assert from 'assert';
import sinon from 'sinon';
import exampleController from './example';
import mockDb from 'mock-knex';
import restify from 'restify';
import Promise from 'bluebird';

const nextPromise = sinon.spy(err => 
    new Promise((resolve, reject) => {
        if (err) reject(err);
        else resolve();
    })
);

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
        let request, response, next, spy;
        beforeEach(() => {
            request = {params: {id: 111}};
            response = { send: () => null };
            next = nextPromise;
            spy = sinon.spy(response, 'send');
        });

        afterEach(() => {
            response.send.restore();
        });

        it('should get a valid thing', () => {
            tracker.on('query', query => {
                assert.equal(query.method, 'first');
                assert.equal(query.bindings[0], 111);
                query.response({value: 'some data'});
            });
            return controller.getThing(request, response, next)
                .then(() => {
                    assert(spy.withArgs(200, {value: 'some data'}).called);
                });
        });

        it('should not get a invalid thing', () => {
            next = sinon.spy(() => null);
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
                    assert(next.withArgs(new restify.NotFoundError('Not found')).called);
                });
        });
    });

    describe('postThing', () => {
        let request, response, next, spy;
        beforeEach(() => {
            request = {body: {value: 'someData'}};
            response = {send: () => null};
            next = nextPromise;
            spy = sinon.spy(response, 'send');
        });

        afterEach(() => {
            response.send.restore();
        });

        it('should return an error if thing is not included', () => {
            next = sinon.spy(() => null);
            delete request.body.value;
            return controller.postThing(request, response, next)
                .then(() => {
                    assert(next.withArgs(new restify.BadRequestError('No thing data was included')));
                });
            
        });

        it('should have postgres call the INSERT query', () => {
            let error = false;
            tracker.on('query', query => {
                assert.equal(query.method, 'insert');
                assert.ok(query.sql.indexOf('insert into "things"') !== -1);
                assert.equal(query.bindings[0], 'someData');
                query.response([110]);
            });
            return controller.postThing(request, response, next);
        });

        it('should return a 201 code on success', () => {
            tracker.on('query', query => {
                query.response([112]);
            });
            return controller.postThing(request, response, next).then(() => {
                assert(spy.withArgs(201).called);
            });
        });

    });

});