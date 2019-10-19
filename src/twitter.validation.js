module.exports = {
    validarHashtags,
    validarTweet
}

function validarHashtags(hashtags) {
    const hitHashtag = "hackathonhitbra";
    let errorMessage = null;

    if (!hashtags.includes(hitHashtag)) errorMessage = `Marcação de evento sem hashtag Hit-Bra definida #Hashtags: ${hashtags.join(', ')}`;

    if (errorMessage) {
        console.log(errorMessage);
        return false;
    }

    return true;
}

function validarTweet(obj) {
    const eventosPermitidos = ["festa", "churrasco", "reunião", "férias"];
    let errorMessage = [];

    if (!eventosPermitidos.includes(obj.tipoEvento.toLowerCase())) {
        errorMessage.push(`Evento do agendamento em formato inválido: ${obj.eventosPermitidos}. Tipos eventos válidos: ${eventosPermitidos.join(', ')}`);
    }

    if(!obj.pessoasEvento.length > 0){
        errorMessage.push(`Evento de agendamento sem pessoas vinculadas.`);
    }

    if (errorMessage.lenght > 0) {
        console.log(errorMessage.join("\n"));
        return false;
    }

    return true;
}

