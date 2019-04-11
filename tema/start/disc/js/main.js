'use strict';
let bug = debug ? '?bug=true' : '';
var dataSemana = hoje().data_sisten;

fetch(app)
    .then(x => x.json())
    .then(y => {
        if (y.length == 0) {
            window.location.href = './manutencao.html';
        }

        vio.modalidade = y.modalidade;
        vio.reservas = y.reservas;

        router('historico-compras', p => {
            let loop = _vio.reservas;
            loop = loop.filter(f => f.usuario_id == _profile.id);
            vio.historico = loop;
        });
        

        router('agenda', x => {
            if (y.reservas != undefined) {
                let quadra = y.quadra.find(y => {
                    let quadraFiltrada = window.location.pathname.split('/');
                    return quadraFiltrada[2] == y.id;
                });
                temp_quadra = quadra;
                let horario = y.horario.filter(h => { return h.quadra == quadra.id; });
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
                let week = semana(dataSemana);
                id_base.forEach(e => {
                    week.forEach(m => {
                        m = m.split('@');
                        agenda.push(`${m[0]}-${e}-${m[1]}-${quadra.id}`);
                    });
                });
                document.querySelector('#reserva__horarios').innerHTML = '<div>Data</div><div>Horarios</div>' + horario.map(h => `<div>${h.inicio} - ${h.final}</div>`).join('');
                document.querySelector('#agenda_reserva').innerHTML = agenda.map(a => `<label id="lb_${a}" onclick="setHorario( '${a}' )" for="pop-agenda-livre"><div class="agenda-disponivel" id="agenda_${a}">Disponivel</div></label>`).join('');
                document.querySelector('#agenda_semana').innerHTML = week.map(a => `<div>${a.split('@')[0].split('-').reverse().join('/')}</div>`).join('');
                rese.forEach(r => {
                    if (document.querySelector(`#agenda_${r.id}`)) {
                        document.querySelector(`#agenda_${r.id}`).innerHTML = 'Ocupado';
                        document.querySelector(`#agenda_${r.id}`).classList.add('agenda__horario_ocupado');
                        document.querySelector(`#lb_${r.id}`).removeAttribute('onclick');
                        document.querySelector(`#lb_${r.id}`).removeAttribute('for');
                    }
                });
            }
        });

        let items = localStorage.cart;
        items = JSON.parse(items);
        vio.cart = items;

    });

window.onpopstate = function () {
    restrito();
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

fetch(`${app}/auth2?profile=${localStorage.token_site}`)
    .then(j => j.json())
    .then(x => {
        fetch(`${app}/time`)
            .then(p => p.json())
            .then(b => {
                vio.time = b;
                _time = b;
            });
        x.pass = '';
        x.password = '';
        _profile = x;
        preencher('atualizar_perfil', x);
        preencher('mudar_senha', x);
    });

if (document.querySelector(`#mes__compras`)) {
    let diaCompra = hoje();
    document.querySelector(`#mes__compras option[value="${+diaCompra.mes}"]`).setAttribute('selected', 'selected');
}
