const mysql = require('mysql');

let conexao = null;

module.exports = {
  conectar,
  inserirTweet,
  listarEventosPorEmpresa
}

function conectar(options) {
  if (conexao == null) {
    return new Promise((resolve, reject) => {

      console.log('Iniciando conexão em banco de dados');

      conexao = mysql.createConnection({
        host: options.host,
        port: options.porta,
        database: options.banco,
        user: options.usuario,
        password: options.senha
      });

      conexao.connect(erro => {
        if (erro) {
          console.error('Erro ao conectar no banco de dados', erro);
          reject(erro);
        } else {
          console.log('Conectado ao banco de dados');
          resolve();
        }
      });

    });
  } else {
    console.log('Aplicação ja esta conectada ao banco de dados');
    return Promise.resolve(conexao);
  }
}

function inserirTweet(tweets) {
  return new Promise((resolve, reject) => {
    conexao.beginTransaction(erro => {
      if (erro) {

        conexao.rollback(() => {
          console.log('Feito rollback em transação');
          reject(erro);
        });

      } else {

        let teste = null;

        const objeto = {
          empresa: tweets.empresa,
          evento: tweets.tipoEvento,
          data_evento: tweets.dataEvento,
          descricao: tweets.descricaoEvento
        };

        // const sql = 'INSERT INTO CLIENT SET name=?, birthday = ?';
        // conexao.query(sql, [cliente.nome, cliente.dataNascimento], (erro, results, fields) => {
        const sql = 'INSERT INTO evento SET ?';
        conexao.query(sql, objeto, (erro, results, fields) => {

          if (erro) {

            conexao.rollback(() => {
              console.log('Feito rollback em transação');
              reject(erro);
            });

          } else {
            const idEvento = results.insertId;

            if (Array.isArray(tweets.pessoasEvento)) {
              const promisesPessoas = tweets.pessoasEvento.map(pessoasEvento => {
                return inserirPessoaEvento(pessoasEvento, idEvento);
              });

              Promise.all(promisesPessoas)
                .then(resultadoPessoas => {
                  conexao.commit(erro => {
                    if (erro) {

                      console.log('Feito rollback em transação');
                      conexao.rollback(() => {
                        reject(erro);
                      });

                    } else {
                      console.log('Transação finalizada com sucesso');
                      console.log(`Evento adicionado com ID ${results.insertId}`);
                      resultadoPessoas.forEach((resultadoPessoas, index) => {
                        console.log(`Pessoa Evento ${tweets.pessoasEvento[index]} adicionado com ID ${resultadoPessoas.insertId}`);
                        tweets.pessoasEvento[index].id = resultadoPessoas.insertId;
                      });

                      tweets.id = idEvento;
                      resolve(tweets);
                    }
                  });
                })
                .catch(erros => {
                  if (!Array.isArray(erros)) {
                    erros = [erros];
                  }

                  erros.forEach(erro => console.error(erro));

                  console.log('Feito rollback em transação');
                  conexao.rollback(() => {
                    reject(erros);
                  });
                });
            } else {
              conexao.commit(erro => {
                if (erro) {

                  console.log('Feito rollback em transação');
                  conexao.rollback(() => {
                    reject(erro);
                  });

                } else {
                  console.log('Transação finalizada com sucesso');
                  console.log(`Evento adicionado com ID ${results.insertId}`);
                  console.log('Sem pessoas cadastradas');
                  tweets.id = idEvento;
                  resolve(tweets);
                }
              });
            }
          }
        });

      }
    });
  })
}

function inserirPessoaEvento(pessoa, idEvento) {
  return new Promise((resolve, reject) => {
    const registroPessoa = {
      nome: pessoa,
      id_evento: idEvento
    };

    const sql = 'INSERT INTO PESSOAS_EVENTO SET ?';

    conexao.query(sql, registroPessoa, (erro, results, fields) => {
      if (erro) {
        reject(erro);
      } else {
        resolve(results);
      }
    });
  });
}

function listarEventosPorEmpresa(empresa) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM `evento` Inner Join `pessoas_evento` on pessoas_evento.id_evento = evento.id WHERE Upper(evento.empresa)  = ? ORDER BY evento.data_evento ASC';

    conexao.query(sql, empresa.toUpperCase(), (erro, results, fields) => {
      if (erro) {
        reject(erro);
      } else {

        results.map(registroEvento => {

          return {
            id: registroEvento.id,
            empresa: registroEvento.empresa,
            tipoEvento: registroEvento.evento,
            dataEvento: registroEvento.data_evento,
            descricao: registroEvento.descricao
          }
        });

        for (const tweet of results) {

          consultarPessoasPorEventos(tweet.id)
            .then(resultadoPessoas => {
              tweet.pessoas = resultadoPessoas;
            })
            .catch(erro => {
              console.log(erro);
            });
        }

        resolve(results);
      }
    });
  });
}

function consultarPessoasPorEventos(idEvento) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM `pessoas_evento` WHERE `pessoas_evento`.`id_evento` = ?';

    conexao.query(sql, idEvento, (erro, results, fields) => {
      if (erro) {
        reject(erro);
      } else {
        resolve(
          results.map(registroPessoa => {
            return {
              id: registroPessoa.id,
              idEvento: registroPessoa.id_evento,
              nome: registroPessoa.nome
            }
          })
        );
      }
    });
  });
}