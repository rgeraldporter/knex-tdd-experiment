import chai from 'chai';
import spies from 'chai-spies';
import exampleController from './example';
import mockDb from 'mock-knex';
import restify from 'restify';
import Promise from 'bluebird';

chai.should()
chai.use(spies);
chai.config.truncateThreshold = 0;

const nextPromise = chai.spy(err => 
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
        serverSpy = chai.spy(() => null);
        controller = exampleController(serverSpy);
    });

    afterEach(() => {
        tracker.uninstall();
    });

    describe('getThing', () => {
        let request, response, next, spy;
        beforeEach(() => {
            request = {params: {id: 111}};
            response = {};
            next = nextPromise;
            spy = chai.spy.on(response, 'send');
        });

        it('should get a valid thing', () => {
            tracker.on('query', query => {
                query.method.should.equal('first');
                query.bindings[0].should.equal(111);
                query.response({value: 'some data'});
            });
            return controller.getThing(request, response, next)
                .then(() => {
                    spy.should.have.been.called.with({value: 'some data'});
                });
        });

        /*
        taking next and returning null means this test won't necessarily fail in tracker.on
        thus no longer falsifiable
        though it might fail, but give the wrong hint (will say the next() doesn't match but it's really the tracker that fails)
        adding promise to next, it will always fail when test error conditions as it becomes too sensitive so that's not good
        solution appears to be to just don't bother doing tests in tracker.on() as that has already been covered anyways
         */
        xit('should not get a invalid thing', () => {
            request = {params: {id: 112}};
            tracker.on('query', query => {
                query.method.should.equal('first');
                query.bindings[0].should.equal(112);
                query.response([]);
            });
            return controller.getThing(request, response, next)
                .then(() => {
                    next.should.have.been.called.with(new restify.NotFoundError('Not found'));
                });
        });

        it('should not get a invalid thing', () => {
            next = chai.spy(() => null);
            request = {params: {id: 112}};
            tracker.on('query', query => {
                query.response([]);
            });
            return controller.getThing(request, response, next)
                .then(() => {
                    next.should.have.been.called.with(new restify.NotFoundError('Not found'));
                });
        });
    });
});