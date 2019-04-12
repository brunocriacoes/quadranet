const log = console.log;
const query = x => document.querySelector(x);
const to = x => { window.location.href = x };
var data = {};

var options =
{
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    credentials: "same-origin",
    method: 'POST',
    mode: 'cors',
    cache: 'default',
    body: null
};

function parametros() {
    let url = window.location.search.replace('?', '');
    let uri = url.split('&').reduce((acc, x) => {
        let para = x.split('=');
        acc[para[0]] = decodeURI(para[1]);
        return acc;
    }, {});
    return uri;
}

const time_stemp = () => { let data = new Date(); return data.getTime(); };

function preencher(seletor, objeto) {
    let formulario = queryAll(`#${seletor} input, #${seletor} textarea, #${seletor} select, #${seletor} img`);
    let lista_var = queryAll(`#${seletor} img:not([src*="ico"])`);
    for (let index = 0; index < lista_var.length; index++) {
        lista_var[index].src = storage + '/' + objeto[lista_var[index].alt || ''] || '';
    }
    let html = objeto.html || '';
    if (html.length > 0) {
        if (query(`#${seletor} .editor-local`)) {
            query(`#${seletor} .editor-local`).innerHTML = objeto.html || '';
        }
    }
    let tmp_name = '';
    let temp_element = '';
    for (let i = 0; i < formulario.length; i++) {
        tmp_name = formulario[i].name || formulario[i].id;
        switch (formulario[i].type) {
            case 'select-one':
                temp_element = query(`#${seletor} select[name='${tmp_name}'] option[value='${objeto[tmp_name]}']`);
                if (temp_element) {
                    temp_element.setAttribute('selected', '');
                }
                break;
            case 'textarea':
                formulario[i].innerHTML = objeto[tmp_name] || '';
                break;
            case 'file':
            case 'submit':
                break;
            default:
                formulario[i].value = objeto[tmp_name] || '';
                break;
        }
    }
}

function query_cep(elemento, seletor = null) {
    let cep = elemento.value;
    cep = cep.replace(/\-/gi, '');
    let total = cep.length;
    if (total == 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(x => x.json())
            .then(x => {
                let obj = x;
                obj.id = 'endereco';
                obj.rua = x.logradouro;
                obj.cidade = x.localidade;
                obj.estado = x.uf;
                if (seletor == null) {
                    preencher(seletor, { ...obj });
                } else {
                    let form = form_data(seletor);
                    preencher(seletor, { ...obj, ...form });
                }
            });
    }
}

function objToUrl(OBJ) {
    let url = Object.keys(OBJ).map(x => {
        return `${x}=${OBJ[x]}`;
    }).join('&');

    return encodeURI(url);
}

function page() {
    let hash = window.location.href.replace(`${base}`, '');
    hash = hash.split('/');;
    return hash[1];
}

function url() {
    let hash = window.location.href.replace(`${base}/`, '');
    hash = hash.split('/');;
    return hash;
}

function router(pag, HOF) {
    let pagina = page();
    if (pagina == pag) {
        HOF();
    }
}

function alerta(str) {
    query('#alerta').style.display = 'block';
    query('#alerta_msg').innerHTML = str;
}

function closeAlerta() {
    query('#alerta').style.display = 'none';
}

function hover_photo(EL, ID) {
    document.querySelector(ID).src = EL.src;
}

function to_float(str) {
    str = str.replace('.', '').replace(',', '.');
    return +str;
}

function get_api(url, hof) {
    fetch(`${app}/${url}`)
        .then(j => j.json())
        .then(x => {
            hof(x);
        });
    return true;
}

function get_form(ID) {
    let form = query(ID);
    let obj = {};
    for (let i = 0; i < form.length; i++) {
        let tmp_name = form[i].id || form[i].name || 'default';
        obj[tmp_name] = form[i].value || form[i].innerHTML || '';
    }
    return obj;
}

function get_form_vio(ID) {
    let form = query(ID);
    let obj = {};
    for (let i = 0; i < form.length; i++) {
        let tmp_name = form[i].id || form[i].name || 'default';
        tmp_name = tmp_name.replace('vio_', '');
        obj[tmp_name] = form[i].value || form[i].innerHTML || '';
    }
    return obj;
}

function disabled_form(ID) {
    let form = query(ID);
    for (let i = 0; i < form.length; i++) {
        form[i].setAttribute('disabled', 'disabled');
    }
    return null;
}
function abled_form(ID) {
    let form = query(ID);
    for (let i = 0; i < form.length; i++) {
        form[i].removeAttribute('disabled');
    }
    return null;
}

function img_default(e) { e.src = "./disc/img/default.jpg"; }
function img_default_banner(e) { e.src = "./disc/img/banner.png"; }
function restrito() {
    let pages = ["perfil", "trocar-senha", "historico-compras", "meu-time", "finalizar"];
    pages.map(x => {
        router(x, y => {
            privado();
        });
    });

}
restrito();

function entrar() {
    let form = get_form('#form_entrar');
    disabled_form('#form_entrar');
    login(form.email || '', form.pass || '', x => {
        abled_form('#form_entrar');
    });
}

function img_default(e) { e.src = "./disc/img/default.jpg"; }

// function day() {
//     let semana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
//     let data = new Date();
//     let day = semana[data.getDay()];
//     return day;
// }

function newDay() {
    let data = new Date();
    let day = data.getDay();
    return day;
}

function set_date(now) {
    fetch(app)
        .then(x => x.json())
        .then(y => {
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
            let week = semana(now.value);
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
        });
}

function menorNove(numero) {
    return (numero < 10) ? `0${numero}` : numero;
}

function date() {
    let data = new Date();
    let dataAtual = menorNove(data.getDate()) + '/' + menorNove((data.getMonth() + 1)) + '/' + data.getFullYear();
    return dataAtual;
}

function reserva() {
    let para = parametros();
    fetch(`${app}/reservas?_dominio=quadranet.com.br&quadra=${para.id}${trol}`)
        .then(x => x.json())
        .then(y => {
            let indisponivel = y.map(p => p.ID.substr(0, 16));
            indisponivel.forEach(x => {
                if (query(`.avulso_${x}`)) {
                    query(`.avulso_${x}`).innerHTML = 'Indisponivel';
                    query(`.avulso_${x}`).classList.add("indisponivel");
                    query(`.avulso_${x}`).removeAttribute('onclick');
                }
                if (query(`.mensal_${x}`)) {
                    query(`.mensal_${x}`).innerHTML = 'Indisponivel';
                    query(`.mensal_${x}`).classList.add("indisponivel");
                    query(`.mensal_${x}`).removeAttribute('onclick');
                }
            });
        });
}

function filtro(select) {
    let id = select.value;
    let lista = document.querySelectorAll('[class*="filter_"]');
    let lista2 = document.querySelectorAll(`[class*="${id}"]`);
    for (let i = 0; i < lista.length; i++) {
        lista[i].setAttribute('hidden', '');
    }
    for (let i = 0; i < lista2.length; i++) {
        lista2[i].removeAttribute('hidden');
    }
    if (id == "A") {
        for (let i = 0; i < lista.length; i++) {
            lista[i].removeAttribute('hidden');
        }
    }

}

_time = [];

function add_player() {
    _time.push({
        nome: query('#player_name').value,
        tel: query('#player_tel').value,
        email: query('#player_mail').value,
        id: time_stemp(),
        id_contratante: _profile.email,
        status: 1,
        presenca: 0,
        obs: ''
    });
    vio.time = _time;
    addJogador();
}

function send_mail() {
    let form = get_form('#send_mail');
    form.to = 'contato@quadranet.com.br';
    form.subject = form.assunto;
    post_api( 'fnc/mail', form, x =>{
        log(x);
        alerta('Enviado com sucesso');
        document.querySelector( '#send_mail' ).reset();
    } );
}

function recuperarSenha() {
    let form = get_form('#formulario_recuperar-senha');
    disabled_form('#formulario_recuperar-senha');
    let url = `${app}/profile/?recovery-pass=${form.email || '17'}${trol}`;
    fetch(url)
        .then(j => j.json())
        .then(x => {
            abled_form('#formulario_recuperar-senha');
            query('#formulario_recuperar-senha').reset;
            alerta('Nova Senha Enviada');
        });
}

function meCadastrar() {
    let form = get_form('#formulario_me-cadastrar');
    let uri = objToUrl(form);
    disabled_form('#formulario_me-cadastrar');
    let url = `${app}/auth2/?create=1&${uri}${trol}`;
    fetch(url)
        .then(j => j.json())
        .then(x => {
            localStorage.setItem('profile', x)
            abled_form('#formulario_me-cadastrar');
            query('#formulario_me-cadastrar').reset;
            window.location.href = 'entrar';
            alerta('Cadastrado Com Sucesso');
        });
}

function atualizarPerfil() {
    let form = get_form('#atualizar_perfil');
    post_api('/auth2/?update=1', form, x => { });
}

function mudarSenha() {
    let form = get_form('#mudar_senha');
    fetch(`${app}/auth2/?alter-pass=${form.email},${form.pass}${trol}`)
        .then(j => j.json())
        .then(x => {
            alerta('Senha Alterada com Sucesso');
        });
}

function addJogador() {
    let time = _time || [];
    time.forEach(e => {
        e.status = 1;
        post_api('time', e, x => { });
        alerta('Jogador adicionado com sucesso!');
        query('#add-jogador').reset();
    });
}

function join_payment(idJogador) {
    get_api(`time?id=${idJogador}`, p => {
        let bombom = (p.presenca == 0) ? 1 : 0;
        post_api('time', { id: idJogador, presenca: bombom }, x => { });
    });
}

function autoSave( url, no, valor, indice ) {
    let obj = { id: no };
    obj[indice] = valor.value || valor.innerHTML;
    obj[indice] = (obj[indice].length == 0) ? 'obs' : obj[indice];
    log(obj[indice])
    post_api( url, obj, x => {} );
}

async function buy() {
    let code = query('#pag-code');
    let btn = query('#pag-send');
    let carrinho = _vio.cart || [];
    let carEstatico = {};

    for (let index = 0; index < carrinho.length; index++) {
        let preco = (carrinho[index].tipocontratacao == 0) ? carrinho[index].mensalidade : carrinho[index].diaria;
        carEstatico[`itemId${index + 1}`] = carrinho[index].id;
        carEstatico[`itemDescription${index + 1}`] = carrinho[index].nome;
        carEstatico[`itemAmount${index + 1}`] = preco.replace(',', '.');
        carEstatico[`itemQuantity${index + 1}`] = '1';
        carEstatico[`itemWeight${index + 1}`] = '1000';
    }

    let cart = {
        usuario_id: _profile.id || '',
        usuario_nome: _profile.name || '',
        usuario_email: _profile.email || '',
        usuario_whatsapp: _profile.whatsapp || '',
        status_compra: 1,
        tipo_pagamento: 1
    };

    carrinho.forEach(x => {
        let obj = {
            _dominio: dominio,
            id: x.id,
            quadra_nome: x.nome,
            tipocontratacao: x.tipocontratacao,
            inicio: x.inicio,
            final: x.final,
            preco: (x.tipocontratacao == 0) ? x.mensalidade : x.diaria,
            site: 1,
            ...cart
        };

        post_api('reservas', obj, o => {

        })
    });

    post_api(`fnc/pagseguro`, carEstatico, p => {
        code.value = p.code;
        if (p.error != undefined) {
            alert('Sua compra não foi finalizada');
        } else {
            btn.click();
            query('#img_pague').style.display = 'none';
            localStorage.setItem('cart', '[]');
        }
        query('#lds-ring').style.display = 'inline-block';
        query('#lds-ring').style.display = 'none';
        query('.btn-finalizar').style.display = 'block';
    })
}

const trash = (url, id_no) => {
    post_api(url, { id: id_no, status: 0 }, x => {
        vio[url] = _vio[url].filter(x => x.id != id_no);
        _time = _time.filter(x => x.id != id_no);
    })
};

function setReserva(ID) {
    fetch(url_api + bug + chache)
        .then(x => x.json())
        .then(y => {
            let q = Object.values(y.quadra.results);
            let quadra = q.find(p => p.ID == ID);
            vio.agenda = Object.values(y.agenda.results).filter(x => x.quadra == ID).map(x => ({ ...x, ID: quadra.ID, foto: quadra.foto, name: quadra.title, init: x.inicio, end: x.final, mensal: quadra.mensal, avulso: quadra.avulso, idAgenda: date().split('/').reverse().join('-') + '-' + x.inicio.replace(':', '-') + '-' + newDay() }));
            let data = date();
            let dia = day();
            vio.agenda_info = { name: quadra.title, modal: tags.title, day: dia, date: data };
        });
}

function marcar() {
    let array = document.querySelectorAll(`section a`);
    for (let index = 0; index < array.length; index++) {
        array[index].classList.remove('active');
    }
    let hash = window.location.hash;
    let arr = document.querySelectorAll(`section [href="${hash}"]`);
    for (let index = 0; index < arr.length; index++) {
        arr[index].classList.add('active');
    }
}

const queryAll = x => {
    return document.querySelectorAll(x)
};

function form_data(id) {
    let formulario = queryAll(`#${id} input, #${id} textarea, #${id} select`);
    for (let i = 0; i < formulario.length; i++) {
        nome = formulario[i].name || formulario[i].id || '';
        valor = formulario[i].value || formulario[i].innerHTML || '';
        if (nome.length > 0 && valor.length > 0) {
            data[nome] = valor;
        }
    }
    return data;
}

function obj_to_url(obj) {
    let indices = Object.keys(obj);
    let url = indices.map(i => `${i}=${obj[i]}`).join('&');
    return encodeURI(url);
}

async function post_api(url, obj, hof) {
    options.body = obj_to_url(obj);
    fetch(`${app}/${url}`, options)
        .then(j => j.json())
        .then(x => {
            hof(x);
        });
    return true;
}

async function post_api_form(url, id_formulario, redirect = null, reset = 0) {
    let formulario = form_data(id_formulario);
    post_api(url, formulario, x => {
        data = {};
        if (redirect != null) {
            to(redirect);
        }
        if (reset == 0) {
            query(`#${id_formulario}`).reset();
        }
        alerta('Cadastrado');

    });
    return true;
}

function hoje(day = '') {
    let data = new Date();
    if (day != '') {
        data = new Date(day);
    }
    let obj = {
        dia: `${data.getDate()}`,
        mes: `${data.getMonth() + 1}`,
        ano: `${data.getFullYear()}`,
        dia_semana: `${data.getDay()}`
    };
    obj.dia = obj.dia.length == 2 ? obj.dia : `0${obj.dia}`;
    obj.mes = obj.mes.length == 2 ? obj.mes : `0${obj.mes}`;
    return {
        ...obj,
        data: `${obj.dia}/${obj.mes}/${obj.ano}`,
        data_sisten: `${obj.ano}-${obj.mes}-${obj.dia}`
    }
}

function duasCasas(data) {
    data = data + '';
    return (data.length == 1) ? '0' + data : data;
}

function semana(data) {
    let result = ['2019-03-31', '2019-04-01', '2019-04-02', '2019-04-03', '2019-04-04', '2019-04-05', '2019-04-06'];
    let hoje = new Date(data);
    let dia = (hoje.getDay() == 6) ? 0 : hoje.getDay() + 1;
    let [ano, mes, diaMes] = data.split('-');
    let quandidade_dias_mes = [0, 31, 28, 31, 30, 31, 30, 31, 30, 31, 30, 31, 30];
    let futuro = +diaMes;
    let passado = (+diaMes - 1 == 0) ? quandidade_dias_mes[+mes - 1] - dia + 1 : +diaMes - dia;
    let mesPassado = (+diaMes - 1 == 0) ? +mes - 1 : +mes;
    for (let index = 0; index < dia; index++) {
        result[index] = `${ano}-${duasCasas(mesPassado)}-${duasCasas(passado++)}@${index}`;
    }
    for (let index = dia; index < 7; index++) {
        result[index] = `${ano}-${duasCasas(mes)}-${duasCasas(futuro++)}@${index}`;
    }

    result[dia] = data + `@${dia}`;
    return result;
}

function editar_agenda(id) {
    let times = vio.horario || [];
    return times.filter(x => x.quadra == id);
}

function DrawAgenda(id) {
    post_api();
}

function edita_quadra(id) {
    if (query('#agenda_contador span')) {
        query('#agenda_contador span').innerHTML = 0;
    }
    horario = [];
    let tmp_quadra = vio.quadra || [];
    tmp_quadra = tmp_quadra[0] || {};
    quadra_sisten = id || tmp_quadra.id || '';
    let data_now = hoje(day.replace(/\-/gi, '/'));
    let horario_temp = editar_agenda(id);
    let quadra = vio.quadra || [];
    quadra = quadra.find(x => x.id == id) || '';
    let modalidade = vio.modalidade || [];
    modalidade = modalidade.find(x => x.id == quadra.modalidade || '') || [];
    if (query('#agenda__tile')) {
        query('#agenda__tile').innerHTML = quadra.nome;
    }
    if (query('#agenda__modalidade')) {
        query('#agenda__modalidade').innerHTML = modalidade.nome || '';
    }
    agenda = [];
    let id_base = horario_temp.map(x => {
        let hora = `${x.inicio}-${x.final}`;
        hora = hora.replace(/:/gi, '-');
        return hora;
    });
    id_base = id_base.sort();
    let toda_semana = semana(data_now.dia_semana, data_now.data_sisten);
    id_base.forEach(x => {
        agenda.push(x);
        for (let i = 0; i < 7; i++) {
            agenda.push(`${toda_semana[i]}-${x}-${i}-${quadra.id}`);
        }
    });
    if (query('.agenda-body')) {
        query('.agenda-body').innerHTML = agenda.map(x => `
        <label for="pop-agenda-livre" id="b${x}" onclick="set_quadra_contratar('${x}')">
            <span id="agenda__dia-semana" class="descktop">LIVRE +</span> 
        </label>
    ` ).join('');
    }
    let toda_agenda = document.querySelectorAll('.agenda-body label');
    toda_agenda.forEach(x => {
        if (x.id.length == 12) {
            let html = x.id.split('-');
            x.innerHTML = `${html[0].replace('b', '')}:${html[1]} às ${html[2]}:${html[3]} `;
            x.classList.add('timer');
        }
    });
    let agendados = vio.agenda || [];

    let todos_dias = document.querySelectorAll('.agenda-header div');
    todos_dias.forEach(x => {
        x.classList.remove('agenda-hoje');
    });
    if (query(`.hoje_${data_now.dia_semana}`)) {
        query(`.hoje_${data_now.dia_semana}`).classList.add('agenda-hoje');
    }

    let reservas = vio.reservas || [];

    let time = new Date();
    let hora = time.getHours();
    let minutos = time.getMinutes();
    let jogando = reservas.filter(x => {
        let id = x.id;
        let init_hora = +id.substr(11, 2);
        let init_minuto = +id.substr(14, 2);
        let end_hora = +id.substr(17, 2);
        let end_minuto = +id.substr(20, 2);
        let dia = x.id.substr(0, 10)

        if (init_hora <= hora && end_hora > hora && dia == day) {
            return true;
        } else {
            return false;
        }
    });
    let id_jogando = jogando.map(x => x.id);

    reservas.forEach(x => {
        let elementor = query(`#b${x.id}`);
        if (elementor) {

            elementor.for = "pop-agenda-ocupado";
            elementor.classList.add('agenda-ocupado');
            let is_jogando = id_jogando.indexOf(x.id);
            if (is_jogando > -1) {
                let id = x.id;
                let init_hora = +id.substr(11, 2);
                let end_hora = +id.substr(17, 2);
                let total_hs = end_hora - hora;
                let init_minuto = +id.substr(14, 2);
                let end_minuto = +id.substr(20, 2);
                let total_mm = init_minuto + end_minuto;
                total_mm = total_mm - minutos;
                let total = (total_hs * 60) + total_mm;
                query('#agenda_contador span').innerHTML = total;
                elementor.classList.add('agenda-jogando');
            }
            elementor.innerHTML = `
                <span class="descktop">
                    <b>${x.contratante_nome}</b>
                    <i>${x.tipo_contatacao == 1 ? 'Diaria' : 'Mensal'}</i>
                </span> 
            `;
        }
    });
}

var temp_quadra = {};
var tempHorario = '';
function setHorario(x) {
    tempHorario = x.split('-');
    let inicio = `${tempHorario[3]}:${tempHorario[4]}`;
    let final = `${tempHorario[5]}:${tempHorario[6]}`;
    tempHorario = { ...temp_quadra, inicio, final, id: x };

    document.querySelector('#btn__reserva_mensal').setAttribute('onclick', `addCart( ${JSON.stringify({ ...tempHorario, tipocontratacao: 0 })} )`);
    document.querySelector('#btn__reserva_diaria').setAttribute('onclick', `addCart( ${JSON.stringify({ ...tempHorario, tipocontratacao: 1 })} )`);
    document.querySelector('#agenda_hor').innerHTML = `Horários: ${inicio}hrs ás ${final}hrs`;
}

function termos() {
    let termo = document.querySelector('#termos__checkbox').checked;
    if (termo) {
        window.location = 'finalizar';
    } else {
        document.querySelector('#termos__checados').innerHTML = '<span>Aceitar os Termos para Continuar!</span>';
        setTimeout(() => {
            document.querySelector('#termos__checados').innerHTML = '';
        }, 2000);
    }
    log(termo);
}

function dataCompra(data) {
    fetch(app)
        .then(x => x.json())
        .then(y => {
            let reservas = y.reservas.filter(r => +r.data.split('/')[1] == data.value);
            document.querySelector('#vio_historico').innerHTML = reservas.map(t => {
                return `     
                <tr>
                <td>${ t.data || '--/--/----'}</td>
                <td>R$ ${ t.preco || '00,00'}</td>
                <td>${ (t.status) ? 'Aguardando Pagamento' : 'Pago'}</td>
                <td><img src="${base}/tema/start/disc/ico/credit-card.png" title="Pagamento"></td>
                <td><a class="btn btn-sucess" href="${base}/historico-jogador?id=${t.id}">Pagamento Jogadores</a></td>
                </tr>
                `;
            }).join('');
        });
}

function contribuiu( idOS, idJogador ) {
    if( _pagos.indexOf( `${idJogador}` ) == -1 ) {
        _pagos = _pagos + `,${idJogador}`;
    }else{
        _pagos = _pagos.replace( `,${idJogador}`, '' );
    }
    let obj = { id: idOS, pagos: _pagos };
    post_api( 'reservas', obj, x => { log(x); } );
}