import 'babel-polyfill';
import hippie from 'hippie';
import {expect} from 'chai';
import server from '../../dist/lib/server';
import Promise from 'bluebird';

describe('Example server', () => {
    describe('GET /example endpoint', () => {
        it('returns a thing when requested', () => {
            return hippie(server)
                .get('/example/111')
                .expectStatus(200)
                .end()
                .then(res => { // TAKE HEED: promise chains in hippie only begin after an empty .end()
                    const body = JSON.parse(res.body);
                    expect(body)
                        .to.contain.all.keys(['value']);
                    expect(body.value).to.be.equal('data');
                });
        });

        it('returns an error when requesting non-existent things', () => {
            return hippie(server)
                .get('/example/112')
                .expectStatus(404)
                .end();
        });
    });
    describe('POST /example endpoint', () => {
        it('returns an id when a new thing is posted', () => {
            return hippie(server)
                .json()
                .post('/example')
                .send({value: 'somedata'})
                .expectStatus(201)
                .end()
                .then(res => {
                    const body = JSON.parse(res.body);
                    expect(body)
                        .to.contain.all.keys(['id']);
                    expect(body.id).to.be.equal(1);

                });
        });
    });
});
