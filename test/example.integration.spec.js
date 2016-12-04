import 'babel-polyfill';
import hippie from 'hippie';
import {expect} from 'chai';
import {server} from '../../dist/index';

describe('Example server', () => {
    describe('/example endpoint', () => {
        it('returns an item when requested', () => {
            return hippie(server)
                .get('/example/111')
                .expectStatus(200)
                .end()
                .then(res => { // MAKE NOTE: promises in hippie only happen after an empty .end()
                    const body = JSON.parse(res.body);
                    expect(body)
                        .to.contain.all.keys(['value']);
                    expect(body.value).to.be.equal('data');
                });
        });

        it('returns an error when requesting non-existent items', () => {
            return hippie(server)
                .get('/example/112')
                .expectStatus(404)
                .end();
        });
    });
});
