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
            document.querySelector('#agenda_reserva').innerHTML = agenda.map(a => `<div id="agenda_${a}">Disponivel</div>`).join('');
            document.querySelector('#agenda_semana').innerHTML = week.map(a => `<div>${a.split('@')[0].split('-').reverse().join('/')}</div>`).join('');
            rese.forEach(r => {
                if (document.querySelector(`#agenda_${r.id}`)) {
                    document.querySelector(`#agenda_${r.id}`).innerHTML = 'Ocupado';
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
    fetch(`${uri_api}/reservas?_dominio=quadranet.com.br&quadra=${para.id}${trol}`)
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

function add_player() {
    vio.time = [{
        name: query('#player_name').value,
        tel: query('#player_tel').value,
        mail: query('#player_mail').value
    }];
}

function send_mail() {
    let form = get_form('#send_mail');
    let url = `${uri_api}/mail/contato@quadranet.com.br/${form.email}/${form.assunto}/${form.mensagem} telefone: ${form.telefone}`;
    url = encodeURI(url);
    disabled_form('#send_mail');
    fetch(url)
        .then(j => j.json())
        .then(x => {
            abled_form('#send_mail');
            query('#alert_send_mail').style.display = 'block';
            query('#send_mail').reset();
        });
}

function recuperarSenha() {
    let form = get_form('#formulario_recuperar-senha');
    disabled_form('#formulario_recuperar-senha');
    let url = `${uri_api}/profile/?recovery-pass=${form.email || '17'}${trol}`;
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
    let url = `${uri_api}/profile/?cadastrar=true&${uri}${trol}`;
    fetch(url)
        .then(j => j.json())
        .then(x => {
            abled_form('#formulario_me-cadastrar');
            query('#formulario_me-cadastrar').reset;
            window.location.href = '#entrar';
            alerta('Cadastrado Com Sucesso');
        });
}

function atualizarPerfil() {
    let form = get_form_vio('#atualizar_perfil');
    let uri = objToUrl(form);
    let url = `${uri_api}/profile/?atualizar=${form.email}&${uri}${trol}`;
    fetch(url)
        .then(j => j.json())
        .then(x => {

        });
}

function mudarSenha() {
    let form = get_form('#mudar_senha');
    let url = `${uri_api}/profile/?alter-pass=${_profile.email}&pass=${form.pass}${trol}`;
    fetch(url)
        .then(j => j.json())
        .then(x => {
            alerta('Senha Alterada com Sucesso');
        });
}

function addJogador() {
    let form = get_form('#add-jogador');
    let url = `${uri_api}/profile/?add-player=${_profile.email}&name=${form.player_name}&tel=${form.player_tel}&mail=${form.player_mail}${trol}`;
    fetch(url)
        .then(j => j.json())
        .then(x => {
            alerta('Jogador adicionado com sucesso!');
            query('#add-jogador').reset();
        });
}

function join_payment(emailCapitao, idJogador) {
    let url = `${uri_api}/profile/?player-buy=${emailCapitao}&usuario=${idJogador}${trol}`;
    fetch(url)
        .then(j => j.json())
        .then(x => {
        });
}

async function buy() {
    let id = new Date().getTime();
    let code = query('#pag-code');
    let btn = query('#pag-send');

    let cart = {
        usuario: _profile.id || '',
        title: _profile.name || '',
        email: _profile.email || '',
        whatsapp: _profile.whatsapp || '',
        cart: _vio.cart || [],
        status: 1,
        payment: 1
    };
    cart = JSON.stringify(cart);
    cart = encodeURI(cart);
    _vio.cart.forEach(x => {
        let obj = {
            _dominio: dominio,
            _method: 'POST',
            ID: x.idAgenda,
            usuario: _profile.id,
            quadra: x.id,
            tipocontratacao: x.status,
            final: x.init,
            _token: null,
        };
        let uri = objToUrl(obj);
        let path = `${uri_api}/reserva/?${uri}${trol}`;
        fetch(path)
            .then(x => x.json())
            .then(x => {

            });
    });
    let path = `${uri_api}/buy/?register=${id}&cart=${cart}${trol}`;
    fetch(path)
        .then(x => x.json())
        .then(x => {
            code.value = x.code;
            // window.location.href = `https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html?code=${x.code}`;
            btn.click();
            query('#lds-ring').style.display = 'none';
            localStorage.setItem('cart', '[]');
            query('.btn-finalizar').style.display = 'block';
        });
    query('#img_pague').style.display = 'none';
    query('#lds-ring').style.display = 'inline-block';
}

function removePlayer(emailCapitao, idJogador) {
    query(`#vio_player_${idJogador}`).style.display = 'none';
    let url = `${uri_api}/profile?player-del=${emailCapitao}&jogador=${idJogador}${trol}`;
    fetch(url)
        .then(j => j.json())
        .then(x => {
        });
}

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
        nome = formulario[i].name || formulario[i].id || 'b'
        valor = formulario[i].value || formulario[i].innerHTML || 'b';
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