const mysql = require('mysql');

let conexao = null;

module.exports = {
  conectar,
  salvarEvento
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

function salvarEvento(empresa,tipoEv,data_evento,hora,descricao, pessoas) {
  return new Promise((resolve, reject) => {
    conexao.beginTransaction(erro => {
      if (erro) {

        conexao.rollback(() => {
          console.log('Feito rollback em transação');
          reject(erro);
        });

      } else {

        const registroEvento = {
          empresa: empresa,
          tipoEv: tipoEv,
          descricao: descricao,
          data_evento: data_evento,
          hora: hora
        };

        // const sql = 'INSERT INTO CLIENT SET name=?, birthday = ?';
        // conexao.query(sql, [cliente.nome, cliente.dataNascimento], (erro, results, fields) => {
        const sql = 'INSERT INTO EVENTO SET ?';
        conexao.query(sql, registroEvento, (erro, results, fields) => {
          if (erro) {

            conexao.rollback(() => {
              console.log('Feito rollback em transação');
              reject(erro);
            });

          } else {
            const idEvento = results.insertId;

            if (Array.isArray(pessoas)) {
              const promisesPessoas = pessoas.map(pessoa => {
                return inserirPessoa(pessoa, idEvento);
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
                      console.log(`Evento adicionado com ID ${idEvento}`);
                      resultadoPessoas.forEach((resultadoPessoa, index) => {
                        console.log(`Pessoa ${pessoas[index]} adicionada com ID ${resultadoPessoa.insertId}`);
                      });
                      resolve();
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
                  console.log(`Cliente ${cliente.nome} adicionado com ID ${results.insertId}`);
                  console.log('Sem telefone cadastrado');
                  cliente.id = idCliente;
                  resolve(cliente);
                }
              });
            }
          }
        });

      }
    });
  })
}

function inserirPessoa(pessoa, idEvento) {
  return new Promise((resolve, reject) => {
    const registroPessoa = {
      pes: pessoa,
      id_evento: idEvento
    };

    const sql = 'INSERT INTO PESSOAS SET ?';

    conexao.query(sql, registroPessoa, (erro, results, fields) => {
      if (erro) {
        reject(erro);
      } else {
        resolve(results);
      }
    });
  });
}

