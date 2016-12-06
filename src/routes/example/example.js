import db from '../../lib/db';
import restify from 'restify';
import Thing from '../../models/thing';
import Promise from 'bluebird';

function successToClient (response) {
    return result => code => {
        response.send(code, result);
        return Promise.resolve(true);
    };
}

function* _getThing (request, response, next) {

    const get = request.params;
    const result = yield Thing.get(get.id);

    if (!result) throw new restify.NotFoundError('Not found');

    yield successToClient(response)(result)(200);
    return next();
}

function* _postThing (request, response, next) {

    const post = request.body;

    if (!post.value) throw new restify.BadRequestError('No thing data was included');

    const id = yield Thing.post(post);
    yield successToClient(response)({id: id[0]})(201);
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
