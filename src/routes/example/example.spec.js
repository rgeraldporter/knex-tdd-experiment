import exampleController from './example';
import mockDb from 'mock-knex';
import restify from 'restify';
import Promise from 'bluebird';

describe('The example controller', () => {
    let tracker, serverSpy, controller;

    beforeEach(() => {
        tracker = mockDb.getTracker();
        tracker.install();
        controller = exampleController();
    });

    afterEach(() => {
        tracker.uninstall();
    });

    describe('getThing', () => {
        let request, response, next;
        beforeEach(() => {
            request = {params: {id: 111}};
            response = {send: () => null};
            next = () => null;
            spyOn(response, 'send').and.callThrough();
        });

        it('should get a valid thing', done => {
            tracker.on('query', query => {
                expect(query.method).toEqual('first');
                expect(query.bindings[0]).toEqual(111);
                query.response({value: 'some data'});
            });
            return controller.getThing(request, response, next)
                .then(() => {
                    expect(response.send).toHaveBeenCalledWith(200, {value: 'some data'});
                    done();
                });
        });

        it('should not get a invalid thing', done => {
            next = jasmine.createSpy();
            request = {params: {id: 112}};
            tracker.on('query', query => {
                expect(query.method).toEqual('first');
                expect(query.bindings[0]).toEqual(112);
                query.response([]);
            });
            controller.getThing(request, response, next)
                .then(() => {
                    expect(next).toHaveBeenCalledWith(new restify.NotFoundError('Not found'));
                    done();
                });
        });
    });

    describe('postThing', () => {
        let request, response, next;
        beforeEach(() => {
            request = {body: {value: 'someData'}};
            response = {send: () => null};
            next = () => null;
            spyOn(response, 'send').and.callThrough();
        });

        it('should return an error if thing is not included', done => {
            next = jasmine.createSpy();
            delete request.body.value;
            controller.postThing(request, response, next)
                .then(() => {
                    expect(next).toHaveBeenCalledWith(new restify.BadRequestError('No thing data was included'));
                    done();
                });
        });

        it('should have postgres call the INSERT query', done => {
            let error = false;
            next = jasmine.createSpy();
            tracker.on('query', query => {
                expect(query.method).toEqual('insert');
                expect(query.sql).toContain('insert into "things"');
                expect(query.bindings[0]).toEqual('someData');
                query.response([110]);
            });
            controller.postThing(request, response, next).then(() => {
                expect(next).toHaveBeenCalled();
                expect(response.send).toHaveBeenCalledWith(201, {id: 110});
                done();
            });
        });
    });

});