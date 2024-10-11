import pactum from 'pactum';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';

describe('Mercado', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://api-desafio-qa.onrender.com/mercado';
  let mercadoId = '';
  let frutaId = '';
  let salgadoId = '';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('Mercado API', () => {
    it('Criação de mercado corretamente', async () => {
      mercadoId = await p
        .spec()
        .post(baseUrl)
        .withJson({
          nome: faker.company.name(),
          cnpj: faker.number.int({ min: 10000000000000, max: 99999999999999 }).toString(),
          endereco: faker.location.secondaryAddress()
        })
        .expectStatus(StatusCodes.CREATED)
        //.expectBodyContains('Mercado criado')
        .returns('_id');
    });

    it('Criação de mercado com CNPJ incorreto', async () => {
      await pactum
        .spec()
        .post(baseUrl)
        .withJson({
          nome: faker.company.name(),
          cnpj: '123',
          endereco: faker.location.secondaryAddress()
        })
        .expectStatus(StatusCodes.BAD_REQUEST)
    });

    it('Busca de mercado', async () => {
        await pactum
        .spec()
        .get(baseUrl)
        .expectStatus(200)
        .withJson([
            {
            id: 1
            }
        ]);
    });

    it('Exclusão de mercado bem sucedido', async () => {
        await pactum
        .spec()
        .delete(`${baseUrl}/${mercadoId}`)
        .expectStatus(200);
      });

    it('Atualiza as informações de mercado existente', async () => {
        await pactum
        .spec()
        .put(`${baseUrl}/${mercadoId}`)
        .expectStatus(200)
        .withJson([
            {
            nome: faker.company.name()
            }
        ]);
    });

    it('Atualiza as informações de mercado mas com dados incorretos', async () => {
        await pactum
        .spec()
        .put(`${baseUrl}/${mercadoId}`)
        .expectStatus(400)
        .withJson([
            {
            cnpj: faker.number.int({ min: 1, max: 100 }).toString(), 
            }
        ]);
    });

    it('Tenta atualizar as informações de mercado inexistente', async () => {
        await pactum
        .spec()
        .put(`${baseUrl}/999`)
        .expectStatus(400)
        .withJson([
            {
            cnpj: faker.number.int({ min: 1, max: 100 }).toString(), 
            }
        ]);
    });

    it('Cadastro correto de FRUTA no HORTIFRUIT', async () => {
        frutaId = await pactum
        .spec()
        .post(`${baseUrl}/${mercadoId}/produtos/hortifuit/frutas`)
        .expectStatus(201)
        .withJson([
            {
                nome: faker.food.fruit(),
                valor: faker.number.float()
            }
        ])
        .expectStatus(StatusCodes.CREATED)
        .returns('__Id');
    });    
    
    it('Cadastro de fruta em mercado que não existe / Deve retornar erro', async () => {
        await pactum
          .spec()
          .post(`${baseUrl}/99999/produtos/hortifuit/frutas`)
          .expectStatus(404)
          .withJson([
            {
                nome: faker.food.fruit(),
                valor: faker.number.float()
            }
        ]);
    });

    it('Deletar fruta de um mercado', async () => {
        await pactum
          .spec()
          .delete(`${baseUrl}/${mercadoId}/produtos/hortifuit/frutas/${frutaId}`)
          .expectStatus(200);
    });

    it('Deletar fruta de um mercado em que ou o mercado ou a fruta não existam', async () => {
        await pactum
          .spec()
          .delete(`${baseUrl}/999999/produtos/hortifuit/frutas/9999`)
          .expectStatus(200);
    });

    it('Cadastro correto de LEGUMES no HORTIFRUIT', async () => {
        await pactum
            .spec()
            .post(`${baseUrl}/${mercadoId}/produtos/hortifuit/legumes`)
            .expectStatus(201)
            .withJson([
             {
                nome: faker.food.vegetable(),
                valor: faker.number.float()
             }
        ]);
    });

    it('Cadastro correto de DOCE na PADARIA', async () => {
        await pactum
            .spec()
            .post(`${baseUrl}/${mercadoId}/produtos/padaria/doces`)
            .expectStatus(201)
            .withJson([
             {
                nome: faker.food.ingredient(),
                valor: faker.number.float()
             }
        ]);
    });

    it('Cadastro correto de SALGADO na PADARIA', async () => {
        salgadoId = await pactum
            .spec()
            .post(`${baseUrl}/${mercadoId}/produtos/padaria/salgado`)
            .expectStatus(201)
            .withJson([
             {
                nome: faker.food.ingredient(),
                valor: faker.number.float()
             }])
             .returns('__Id');
    });

    it('Busca de salgados bem sucedida', async () => {
        salgadoId = await pactum
            .spec()
            .get(`${baseUrl}/${mercadoId}/produtos/padaria/salgado`)
            .expectStatus(200)
    });

    it('Busca de salgados em que o mercado não existe', async () => {
        salgadoId = await pactum
            .spec()
            .get(`${baseUrl}/99999/produtos/padaria/salgado`)
            .expectStatus(404)
    });
});
});