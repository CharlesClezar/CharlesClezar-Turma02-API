import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('Deck of cards', () => {
    const p = pactum;
    const rep = SimpleReporter;
    const baseUrl = 'https://deckofcardsapi.com/api';
    let deckId = '';

    p.request.setDefaultTimeout(30000);

    beforeAll(() => p.reporter.add(rep));
    afterAll(() => p.reporter.end());

    describe('', () => {
        it('', async () => {
          await p
            .spec()
            .post(`${baseUrl}/deck/new/`)
            .withJson(
                
            )
            .expectStatus(StatusCodes.OK)
            .expectJsonLike({
                            },
            });
        });
})