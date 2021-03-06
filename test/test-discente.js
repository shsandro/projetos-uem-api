const request = require('request');
const rp = require('request-promise-native');
const expect = require('chai').expect;

const baseUrl = 'http://localhost:3001/api';

const postTest = {
  ra: '104016',
  curso: 'Ciência da Computação',
  turno: 'Integral',
  campus: 'Maringá',
  serie: 3,
  situacaoAcademica: 'Matriculado'
};

const updateTest = {
  ra: '104016',
  curso: 'Ciência da Computação',
  turno: 'Integral',
  campus: 'Sede',
  serie: 3,
  situacaoAcademica: 'Matriculado'
};

const raDuplicadoTest = {
  ra: '103235',
  curso: 'Ciência da Computação',
  turno: 'Integral',
  campus: 'Maringá',
  serie: 3,
  situacaoAcademica: 'Matriculado'
};

const situacaoAcademicaDisconhecidaTest = {
  ra: '98397',
  curso: 'Ciência da Computação',
  turno: 'Integral',
  campus: 'Maringá',
  serie: 3,
  situacaoAcademica: 'Cursando'
};

describe('Modelo Discente', () => {
  describe('Testes CRUD', () => {
    it('Deveria criar um novo Discente e retornar status 200', done => {
      request.post(
        {
          headers: {'content-type': 'application/json'},
          url: `${baseUrl}/Discentes`,
          body: JSON.stringify(postTest)
        },
        (error, response, body) => {
          const obj = JSON.parse(response.body);

          postTest['id'] = obj.id;
          expect(response.statusCode).to.equal(200);
          expect(obj.ra).to.equal(postTest.ra);
          expect(obj.curso).to.equal(postTest.curso);
          expect(obj.turno).to.equal(postTest.turno);
          expect(obj.campus).to.equal(postTest.campus);
          expect(obj.serie).to.equal(postTest.serie);
          expect(obj.situacaoAcademica).to.equal(postTest.situacaoAcademica);
          done();
        }
      );
    });

    it('Deveria retornar status 200 e o Discente cadastrado nos testes', done => {
      request.get(
        {
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json'
          },
          url: `${baseUrl}/Discentes/${postTest.id}`
        },
        (error, response, body) => {
          const obj = JSON.parse(response.body);

          expect(response.statusCode).to.equal(200);
          expect(obj.ra).to.equal(postTest.ra);
          expect(obj.curso).to.equal(postTest.curso);
          expect(obj.turno).to.equal(postTest.turno);
          expect(obj.campus).to.equal(postTest.campus);
          expect(obj.serie).to.equal(postTest.serie);
          expect(obj.situacaoAcademica).to.equal(postTest.situacaoAcademica);
          done();
        }
      );
    });

    it('Deveria retornar status 401 ao tentar atualizar os atributos de um Discente sem se identificar', async () => {
      try {
        const response = await rp.patch({
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json'
          },
          url: `${baseUrl}/Discentes/${postTest.id}`,
          body: JSON.stringify(updateTest)
        });

        expect(response.statusCode).to.equal(401);
      } catch (err) {}
    });

    it('Deveria retornar status 401 ao tentar remover um Discente sem se identificar', async () => {
      try {
        const response = await rp.delete({
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json'
          },
          url: `${baseUrl}/Discentes/${postTest.id}`
        });

        expect(response.statusCode).to.equal(401);
      } catch (err) {}
    });

    describe('Testes de duplicação e integridade de dados', () => {
      it('Deveria retornar status 400 e a mensagem "RA já cadastrado" ao tentar cadastrar um RA já existente', done => {
        request.post(
          {
            headers: {'content-type': 'application/json'},
            url: `${baseUrl}/Discentes`,
            body: JSON.stringify(raDuplicadoTest)
          },
          () => {
            request.post(
              {
                headers: {'content-type': 'application/json'},
                url: `${baseUrl}/Discentes`,
                body: JSON.stringify(raDuplicadoTest)
              },
              (error, response, body) => {
                body = JSON.parse(body);

                expect(response.statusCode).to.equal(400);
                expect(body.error.message).to.equal('RA já cadastrado');
                done();
              }
            );
          }
        );
      });

      it('Deveria retornar status 400 e a mensagem "Situação acadêmica desconhecida" ao tentar cadastrar uma situação acadêmica não conhecida', done => {
        request.post(
          {
            headers: {'content-type': 'application/json'},
            url: `${baseUrl}/Discentes`,
            body: JSON.stringify(situacaoAcademicaDisconhecidaTest)
          },
          (error, response, body) => {
            body = JSON.parse(body);

            expect(response.statusCode).to.equal(400);
            expect(body.error.message).to.equal('Situação acadêmica desconhecida');
            done();
          }
        );
      });
    });
  });
});
