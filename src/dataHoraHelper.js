module.exports = {
    dataHoraFormatada
}

function dataHoraFormatada(data){
        dia  = data.substring(0, 2);
        mes  = data.substring(3, 5); //+1 pois no getMonth Janeiro começa com zero.
        ano  = data.substring(6, 10);

    return `${ano}/${mes}/${dia}`;
}