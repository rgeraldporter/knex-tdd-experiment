import db from '../../lib/db';
import restify from 'restify';
import Thing from '../../models/thing';
import Promise from 'bluebird';

function successToClient (response) {
    return result => {
        response.send(200, result);
        return Promise.resolve(true);
    };
}

function* _getThing (request, response, next) {

    const get = request.params;
    const result = yield Thing.get(get.id);

    if (!result) throw new restify.NotFoundError('Not found');
    yield successToClient(response)(result);
    return next();
}

function* _postThing (request, response, next) {

    const post = request.params;

    const id = yield Thing.post(post);
    yield successToClient(response)({id: id});
    return next();
}

function getThing (request, response, next) {

    return Promise.coroutine(_getThing)(request, response, next)
        .catch(err => {
            return next(err);
        });  
}

function postThing (request, response, next) {

    return Promise.coroutine(_postThing)(request, response, next)
        .catch(err => {
            return next(err);
        });  
}

export default server => ({
    getThing,
    postThing
});
