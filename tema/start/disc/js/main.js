'use strict';
let bug  = debug ? '?bug=true' : '';
fetch( app )
    .then(x => x.json())
    .then(y => {
        if( y.length == 0 ) {
            window.location.href = './manutencao.html';
        }
        let quadra = y.quadra;
        const conjunto = Object.values(quadra);
        vio.quadra = conjunto;
        
        router('agenda', x => {
            if( y.reservas != undefined )
            {
                let agendas     = y.reservas;
                log(agendas);
                let conj        = Object.values(reservas);
                let para        = url()[1];
                let category    = y.tag;
                let quadra      = conjunto.find(p => p.ID == para);
                let comp        = Object.values(category);
                let tags        = comp.find(p => p.ID == quadra.tag);
                vio.agenda      = conj.map(y => ({ ID: quadra.ID, foto: quadra.foto, name: quadra.title, modal: tags.title, init: y.inicio, end: y.final, mensal: quadra.mensal, avulso: quadra.avulso, idAgenda: date().split('/').reverse().join('-') + '-' + y.inicio.replace(':', '-') + '-' + newDay() }));
                let data        = date();
                let dia         = day();
                vio.agenda_info = { name: quadra.title, foto: quadra.foto, modal: tags.title, day: dia, date: data };
                reserva();
            }
        });

        let items = localStorage.cart;
        items     = JSON.parse(items);
        vio.cart  = items;
        
});
    
window.onpopstate = function()
{
    restrito();
    router( 'sair', () => { logout(); } );
    vio.perfil = {
        nome      : _profile.name || '',
        apelido   : _profile.nickname || '',
        email     : _profile.email || '',
        cpf       : _profile.cpf || '',
        cep       : _profile.cep || '',
        estado    : _profile.estado || '',
        cidade    : _profile.cidade || '',
        endereco  : _profile.endereco || '',
        whatsapp  : _profile.whatsapp || '',
    };
    vio.historico = _profile.history || []; //[ { id:, status:, day:, price: } ];
    _vio.time = []; 
    vio.time  = _profile.tean || []; //[{name tel mail}]

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

router( 'historico-compras', p => {
    let profile = localStorage.profile;
    profile = JSON.parse(profile);
    let historico = profile.history.map( x => ({ id: x.transacao || '', status: x.payment || '', day: x.data || '', price: x.price || '11'}) );
    vio.historico = historico
} );


