'use strict';
let bug = debug ? '?bug=true' : '';
fetch(app)
    .then(x => x.json())
    .then(y => {
        if (y.length == 0) {
            window.location.href = './manutencao.html';
        }
        let quadra = y.quadra;
        const conjunto = Object.values(quadra);
        vio.quadra = conjunto;

        router('agenda', x => {
            if (y.reservas != undefined) {
                let quadra = y.quadra.find(y => {
                    let quadraFiltrada = window.location.pathname.split('/');
                    return quadraFiltrada[2] == y.id;
                });
                let horario = y.horario.filter(h => {
                    return h.quadra == quadra.id;
                });
                let rese = y.reservas.filter(r => {
                    let idQuadra = r.id.split('-');
                    return idQuadra[8] == quadra.id;
                });
                agenda = [];
                let id_base = horario.map(x => {
                    let hora = `${x.inicio}-${x.final}`;
                    hora = hora.replace(/:/gi, '-');
                    return hora;
                });
                id_base = id_base.sort();
                let week = semana( '2019-04-01' );
                id_base.forEach(e => {
                    week.forEach(m => {
                        agenda.push(`${m}-${e}-${quadra.id}`);
                    });
                });
                log(agenda);
            }
        });

        let items = localStorage.cart;
        items = JSON.parse(items);
        vio.cart = items;

    });

window.onpopstate = function () {
    restrito();
    router('sair', () => { logout(); });
    vio.perfil = {
        nome: _profile.name || '',
        apelido: _profile.nickname || '',
        email: _profile.email || '',
        cpf: _profile.cpf || '',
        cep: _profile.cep || '',
        estado: _profile.estado || '',
        cidade: _profile.cidade || '',
        endereco: _profile.endereco || '',
        whatsapp: _profile.whatsapp || '',
    };
    vio.historico = _profile.history || []; //[ { id:, status:, day:, price: } ];
    _vio.time = [];
    vio.time = _profile.tean || []; //[{name tel mail}]

    marcar();
};

marcar();

router('detalhe', z => {
    fetch(url_api)
        .then(x => x.json())
        .then(y => {
            let quadra = y.quadra;
            let para = parametros();
            let conjunto = Object.values(quadra.results);
            let conjquadra = conjunto.find(p => p.ID == para.id);
            vio.detalhe = { title: conjquadra.title, text: conjquadra.resumo, img_1: conjquadra.foto, img_2: conjquadra.foto1, img_3: conjquadra.foto2, img_4: conjquadra.foto3, img_5: conjquadra.foto4, ID: conjquadra.ID };
        });
});

router('historico-compras', p => {
    let profile = localStorage.profile;
    profile = JSON.parse(profile);
    let historico = profile.history.map(x => ({ id: x.transacao || '', status: x.payment || '', day: x.data || '', price: x.price || '11' }));
    vio.historico = historico
});


