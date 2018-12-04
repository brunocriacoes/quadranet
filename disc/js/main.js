'use strict';
let bug  = debug ? '?bug=true' : '';
fetch( url_api + bug )
    .then(x => x.json())
    .then(y => {        
        if( y.length == 0 ) {
            window.location.href = './manutencao.html';
        }
        let quadra = y.quadra;
        const conjunto = Object.values(quadra.results);
        vio.quadra = conjunto;

        if( y.quem !== undefined )
        {
            let quem = y.quem;
            let resum = quem.results.quem || '';
            query('.footer__about').innerHTML = `
            <h2>Quem Somos?</h2>
            <p>
                ${resum.resumo}
            </p>
            `;
            let sobre = y.quem.results.quem;
            vio.sobre = {
                title: sobre.title || '',
                content: sobre.html || '',
                foto_1: sobre.foto || '',
                foto_2: sobre.foto1 || '',
                foto_3: sobre.foto2 || '',
                foto_4: sobre.foto3 || '',
                foto_5: sobre.foto4 || '',
            };
        }

        if( y.service !== undefined ) 
        {
            let service = y.servico;
            let resume = service.results.servico;
            query('#card__services__paragrafo').innerHTML = `${resume.resumo}`;
            let servico = y.servico.results.servico;
            vio.servico = servico.html || '';
        }

        if( y.banner !== undefined ) 
        {
            vio.banner = Object.values(y.banner.results).map(x => ({ text: x.title, link: x.url, foto: x.foto }));
        }

        if( y.visual !== undefined ) 
        {
            let visual = y.visual.results.visual;
            vio.title = visual.title;
            vio.description = visual.description;
            vio.keywords = visual.keyword;
            vio.facebook = visual.facebook;
            vio.twitter = visual.twitter;
            vio.youtube = visual.youtube;
            vio.logo = visual.foto;
    
            query('#personalizar').innerHTML = `
                :root {
                    --theme: ${visual.cor};
                }
            `;
            let contato = y.visual.results.visual;
            vio.contato = {
                text : contato.contato,
                email: contato.email,
                tel  : contato.tel,
                map  : contato.map.replace( /\\/ig, '' ),
            };
        }

        if( y.tag !== undefined )
        {
            const tag = y.tag.results;
            let tipo = Object.values(tag)
                .map(p => {
                    return `<option value="${p.ID}">${p.title}</option>`;
                });
            query('#fields_type_select').innerHTML += tipo;
        }


        router('agenda', x => {
            if( y.agenda !== undefined )
            {
                let agendas     = y.agenda;
                let conj        = Object.values(agendas.results);
                let para        = parametros();
                let quadra      = conjunto.find(p => p.ID == para.id);
                vio.agenda      = conj.map(y => ({ ID: quadra.ID, name: quadra.title, init: y.inicio, end: y.final, mensal: quadra.mensal, avulso: quadra.avulso, idAgenda: date().split('/').reverse().join('-') + '-' + y.inicio.replace(':', '-') + '-' + newDay() }));
                let category    = y.tag.results;
                let comp        = Object.values(category);
                let tags        = comp.find(p => p.ID == quadra.tag);
                let data        = date();
                let dia         = day();
                vio.agenda_info = { name: quadra.title, modal: tags.title, day: dia, date: data };
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
        nome     : _profile.name || '',
        apelido  : _profile.nickname || '',
        email    : _profile.email || '',
        whatsapp : _profile.whatsapp || '',
    };
    vio.historico = _profile.history || []; //[ { id:, status:, day:, price: } ];
    _vio.time = []; 
    vio.time  = _profile.tean; //[{name tel mail}]
};

router('detalhe', z => {
    fetch(url_api)
        .then(x => x.json())
        .then(y => {
            let quadra = y.quadra;
            let para = parametros();
            let conjunto = Object.values(quadra.results);
            let conjquadra = conjunto.find(p => p.ID == para.id);
            log(conjquadra);
            vio.detalhe = { title: conjquadra.title, text: conjquadra.resumo, img_1: conjquadra.foto, img_2: conjquadra.foto1, img_3: conjquadra.foto2, img_4: conjquadra.foto3, img_5: conjquadra.foto4, ID: conjquadra.ID };
        });
});
