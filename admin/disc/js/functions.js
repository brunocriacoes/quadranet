"use strict";

const query      = x => document.querySelector(x);
const queryAll   = x => document.querySelectorAll(x);
const log        = console.log;
const table      = console.table;
const time_stemp = () => { 
    let data = new Date();
    return data.getTime();
}

const to   = x => { window.location.href = x };
const back = x => { window.history.back() };

function form_data( id ) 
{
    let formulario = queryAll( `#${id} input, #${id} textarea, #${id} select` );
    let html       = '';
    if( query( `#${id} .editor-local` ) ) {
        html       = query( `#${id} .editor-local` ).innerHTML || '';
    }
    let data  = {};
    let nome  = '';
    let valor = '';
    for( let i = 0; i < formulario.length; i++ ) {
        nome  = formulario[i].name || formulario[i].id || -1;
        valor = formulario[i].value || formulario[i].innerHTML || '';
        if( nome != -1 && valor.length > 0 ) {
            data[nome] = valor;
        }
    }
    if( html.length > 0 ) {
        html      = html.replace(/"/gi, '\"')
        data.html = html;
    }
    return data;
}

function obj_to_url( obj )
{
    let indices =  Object.keys( obj );
    let url     = indices.map( i => `${i}=${obj[i]}` ).join('&');
    return encodeURI( url );
}

async function post_api( url, obj, hof )
{
    options.body   = obj_to_url( obj );
    fetch( `${app}/${url}`, options )
    .then( j => j.json() )
    .then( x => {
        hof( x );
    } );
    return true;
}

function get_api( url, hof )
{
    fetch( `${app}/${url}` )
    .then( j => j.json() )
    .then( x => {
        hof( x );
    } );
    return true;
}

async function post_api_form( url, id_formulario, redirect = null, reset = 0 )
{
    let formulario    = form_data( id_formulario );
    let send          = await sendImage();

    let tipoContrataca = formulario.tipo_contatacao || 1
    if( tipoContrataca == "2" ) {
        let ID                 = formulario.id
        let dataLocacao        = ID.substr(0,10) 
        let idQuadra           = ID.substr(25,34)
        let inicioHs           = ID.substr(11,5).replace('-', ':')
        let finalHs            = ID.substr(17,5).replace('-', ':')
        let pegaData           = new Date(dataLocacao)
        let tradaDia           = pegaData.getDay() + 1;
        tradaDia               = tradaDia < 7 ? tradaDia : 0        
        let ListaReservaMensal = agendarMensal( tradaDia, idQuadra, inicioHs, finalHs )
        ListaReservaMensal.forEach( idReserva => {
            post_api( url, {...formulario, id: idReserva}, () =>{} )
        } )
    }
    
    formulario        = { ... formulario, ... send };
    vio.aside_quadra  = 1;
    post_api( url, formulario, x => {
        gravar_horario( x.id );        
        files     = {};
        cart      = [];
        edit      = {};
        horario   = [];
        let eco =  vio.ecosistema || [];
        eco.forEach( z => {
            let select =  `.eco-option-${z.id||''}`;
            if( query( select ) ) {
                query( select ).classList.remove(`nao-mostra`);
                query( select ).classList.add(`mostra`);
                query( `.eco-install-${z.id}` ).classList.add('nao-mostra');
            }        
        } );
        if ( redirect != null ) {
            if( reset == 0 ) {
                query( `#${id_formulario}` ).reset();
            }           
            _vio[url] = _vio[url] || [];
            vio[url]  = _vio[url].filter( y => x.id != y.id );
            vio[url]  = [ ... [x], ... _vio[url] ];
            to( `${admin}/${redirect}` );
            alerta( 'Salvo com Sucesso!' );
        }      

    } );
    return true;
}

async function sendImage() {
    var obj = {};
    let arqui = Object.keys(files);
    if ( arqui.length !== 0 ) {
        for (let index = 0; index < arqui.length; index++) {
            options.body = encodeURI(`file=${files[arqui[index]]}`);
            var foto = await fetch( storage, options )
            .then( j => j.json() )
            .then( x => {
                obj[arqui[index]] = x.name;
            } );
        }
    }
    return obj;
}

const editar = ( url, id, formulario, redirect = null ) => {
    let data             = vio[url] || [];
    let objeto           = data.find( x => id == x.id ) || {};
    objeto.id            = id;
    edit                 = objeto;    
    objeto.update        = 1;
    objeto.pass          = '';
    objeto.password      = '';
    editar_horarios( objeto.id );
    vio.mostrar_horarios = 1;
    if( redirect != null ) {
        to( `${admin}/${redirect}` );
    }
    preencher( formulario, objeto );
};

function hoje( day = '' ) {
    let data = new Date();
    if( day != '' ) {
        data = new Date( day );
    }
    let obj = {
        dia : `${data.getDate()}`,
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

function mudar_data( e ) {
    day = e.value;
    edita_quadra( quadra_sisten );
}

function semana( dia, data )
{
    let data_arr            = data.split('-');
    let quandidade_dias_mes = [0, 31, 28, 31, 30, 31, 30, 31, 30, 31, 30, 31, 30 ];
    let mes                 = +data_arr[1];
    let max                 = quandidade_dias_mes[mes];
    let semana              =  [ "DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB",  ];
    let futuro              = +data_arr[2];
    let passado             = +data_arr[2] - +dia;
    
    for( let p = 0; p < dia; p++ ) {
        if( passado <= 0 ) {
            passado = max - +dia;
            data_arr[1] = +data_arr[1] - 1;
            data_arr[0] = data_arr[1] > 0 ? data_arr[0] : +data_arr[0] - 1;
            data_arr[1] = data_arr[1] > 0 ? data_arr[1] : 12;
            data_arr[1] = `${data_arr[1]}`;
            data_arr[1] = data_arr[1].length == 1 ? `0${data_arr[1]}` : data_arr[1];
        }
        let atemporal = passado++;
        atemporal     = atemporal < 10 ? `0${atemporal}` : atemporal; 
        semana[p] = `${data_arr[0]}-${data_arr[1]}-${atemporal}`;
    }
    for( let f = dia; f < 7; f++ ) {
        if( futuro > max ) {
            futuro = 1;
            data_arr[1] = +data_arr[1] + 1;
            data_arr[1] = data_arr[1] < 13 ? data_arr[1] : 1;
            data_arr[1] = `${data_arr[1]}`;
            data_arr[1] = data_arr[1].length == 1 ? `0${data_arr[1]}` : data_arr[1];
        }
        let atemporal = `${futuro++}`;
        atemporal = atemporal.length == 1 ? `0${atemporal}` : atemporal;
        semana[f] = `${data_arr[0]}-${data_arr[1]}-${atemporal}`;
    }
    semana[dia] = data;
    return semana;
}
function quadra_em_edicao( id ) {
    queryAll(`[class*="ativa_quadra_"]`).forEach( x => x.classList.remove('ativa') );
    let quadra_a_ativar = query(`[class*="ativa_quadra_${id}"]`);
    if( quadra_a_ativar ) {
        quadra_a_ativar.classList.add('ativa');
    }
}
function edita_quadra( id ) {
    query('#agenda_contador span').innerHTML = 0;   
    horario = [];
    let tmp_quadra  = vio.quadra || []
    tmp_quadra      = tmp_quadra.find( q => q.id == id );
    // tmp_quadra      = tmp_quadra || vio.quadra[0] || [];
    tmp_quadra      = tmp_quadra || {};
    quadra_em_edicao( tmp_quadra.id || '');

    query("#reserva_quadra").innerHTML = tmp_quadra.nome;
    query("#ocupado_quadra").innerHTML = tmp_quadra.nome;

    query("#editar_quadra__agenda").setAttribute( 'onclick', `editar( 'quadra', '${id}', 'quadra_nova__form', 'dash.html#quadra-agenda' )` );

    quadra_sisten = id || tmp_quadra.id || '';
    let data_now  = hoje( day.replace(/\-/gi, '/') );
    let horario_temp = editar_agenda( id );
    let quadra     = vio.quadra || [];
    quadra         = quadra.find( x => x.id == id ) || '';
    let modalidade = vio.modalidade || [];
    modalidade     = modalidade.find( x => x.id == quadra.modalidade || '' ) || [];
    query('#agenda__tile').innerHTML       = quadra.nome;
    query('#agenda__modalidade').innerHTML = modalidade.nome || '';
    query("#reserva_modalidade i").innerHTML = modalidade.nome || '';
    query("#ocupado_modalidade i").innerHTML = modalidade.nome || '';
    agenda = [];
    let id_base = horario_temp.map( x => {
        let hora = `${x.inicio}-${x.final}`;
        hora = hora.replace(/:/gi, '-');
        return hora;
    } );
    id_base = id_base.sort();
    let toda_semana = semana( data_now.dia_semana, data_now.data_sisten );
    id_base.forEach( x => {
        agenda.push( x );
        for( let i = 0; i < 7; i++) {
            agenda.push( `${toda_semana[i]}-${x}-${i}-${quadra.id}` );
        }
    } );
   
    query('.agenda-body').innerHTML = agenda.map( x => `
        <label for="pop-agenda-livre" id="b${x}" onclick="set_quadra_contratar('${x}')">
            <span id="agenda__dia-semana" class="descktop">LIVRE +</span> 
        </label>
    ` ).join('');
    let toda_agenda = queryAll( '.agenda-body label' );
    toda_agenda.forEach( x => {
        if( x.id.length == 12 ) {
            let html = x.id.split('-');
            x.innerHTML = `${html[0].replace('b','')}:${html[1]} às ${html[2]}:${html[3]} `;
            x.classList.add('timer');
        }
    } );
    let agendados = vio.agenda || []; 

    let todos_dias = queryAll( '.agenda-header div' );
    todos_dias.forEach( x => {
        x.classList.remove('agenda-hoje');
    } );
    query(`.hoje_${data_now.dia_semana}`).classList.add('agenda-hoje');    
    
    let reservas = vio.reservas || [];

    let time    = new Date();
    let hora    = time.getHours();
    let minutos = time.getMinutes();
    let jogando = reservas.filter( x => {
        let id = x.id;
        let init_hora   = +id.substr( 11, 2 );
        let init_minuto = +id.substr( 14, 2 );
        let end_hora    = +id.substr( 17, 2 );
        let end_minuto  = +id.substr( 20, 2 );
        let dia         = x.id.substr(0, 10)
       
        if ( init_hora <= hora && end_hora > hora && dia == day  ) {
            return true;
        } else {
            return false;
        }
    } );
    let id_jogando = jogando.map( x => x.id);
    
    reservas.forEach( x => {
        let elementor = query(`#b${x.id}`);
        
        if( elementor ) {
            elementor.removeAttribute('onclick');
            elementor.removeAttribute('for');
            elementor.setAttribute('for',"pop-agenda-ocupado");
           
            elementor.for = "pop-agenda-ocupado";
            elementor.classList.add('agenda-ocupado');
            let is_jogando = id_jogando.indexOf( x.id );
            if( is_jogando > -1 ) {
                let id          = x.id;
                let init_hora   = +id.substr( 11, 2 );
                let end_hora    = +id.substr( 17, 2 );
                let total_hs    = end_hora - hora;
                let init_minuto = +id.substr( 14, 2 );
                let end_minuto  = +id.substr( 20, 2 );
                let total_mm    = init_minuto + end_minuto;
                total_mm        = total_mm - minutos;
                let total       = ( total_hs * 60 ) + total_mm;
                query('#agenda_contador span').innerHTML = total;
                elementor.classList.add('agenda-jogando');
            }
            elementor.innerHTML = `
                <span class="descktop" onclick="pop_ocupado('${x.id}')">
                    <b>${x.user_nome || ''}</b>
                    <i>${x.tipo_contatacao == 1 ? 'Diaria' : 'Mensal'}</i>
                </span> 
            `;            
        }
    } );
}

function pop_ocupado( id ) {
    let horario = id.substr(11,5).replace('-', ':') + " - " + id.substr(17,5).replace('-', ':');
    query("#ocupado_horario").innerHTML = horario;
    let reserva = vio.reservas.find( x => x.id == id );
    query("#v-ocupado-nome").innerHTML = reserva.contratante_nome;
    query("#v-ocupado-telefone").innerHTML = reserva.contratante_Id;
    query("#v-ocupado-contratacao").innerHTML = reserva.tipocontratacao == "1" ? "Avulso" : "mensal"; 
    query("#v-ocupado-pagamento").innerHTML = reserva.pagamento;
    query("#v-ocupado-link").setAttribute('href',`${uri}/admin/dash.html?id=${id}#os` );
}

const trash = ( url, id, fnc = null  ) => {
    let elemento = vio[url] || []
    elemento     = elemento.find( x => x.id == id ) || {}
    query("#deletar_nome").innerHTML = elemento.nome || ''
    query("#confirmar_delete").click()
    query("#btn_deletar_confirmar").setAttribute('onclick', `trashConfirmado( '${url}', '${id}', ${fnc || null} )`)
};

function trashConfirmado( url, id, fnc = null ) {
    let elemento = vio[url] || []
    elemento     = elemento.find( x => x.id == id ) || {}
    let quadraId = elemento.id.substr(25, 32)
    let diaSema  = elemento.id.substr(23, 1)
    let tipoContratacao = elemento.tipo_contatacao || 1
    if( tipoContratacao == "2" ) {
        let listaReservas    = vio.reservas  || []
        let reservasNaoPagas = listaReservas
            .filter( p => p.status_compra != "2" )
            .filter( u => u.usuario_id == elemento.usuario_id )
            .filter( u => u.id.substr(25, 32) == quadraId )
            .filter( u => u.id.substr(23, 1) == diaSema )
        reservasNaoPagas.forEach( reservas => {
            post_api( url, { 'id': reservas.id, status: 0 }, x => {
                vio[url] = _vio[url].filter( x => id != x.id );
                if( fnc != null ) {
                    fnc()
                }
            } )
        } )
    }
    post_api( url, { 'id': id, status: 0 }, x => {
        vio[url] = _vio[url].filter( x => id != x.id );
        if( fnc != null ) {
            fnc()
        }
    } )
    alerta('Removido com sucesso')
}

function preencher( seletor, objeto )
{
    let formulario = queryAll( `#${seletor} input, #${seletor} textarea, #${seletor} select, #${seletor} img` );
    let lista_var = queryAll(`#${seletor} img:not([src*="ico"])`);
    for (let index = 0; index < lista_var.length; index++) {
        lista_var[index].src = storage + '/' + objeto[lista_var[index].alt || ''] || '';
    }
    let html = objeto.html || '';
    if( html.length > 0 ) {
        if(query( `#${seletor} .editor-local` )) {
            query( `#${seletor} .editor-local` ).innerHTML = objeto.html || '';
        }
    }    
    let tmp_name      = '';
    let temp_element  = '';
    for( let i = 0; i < formulario.length; i++ ) {
        tmp_name = formulario[i].name || formulario[i].id;
        switch (formulario[i].type) {
            case 'select-one':
                temp_element = query( `#${seletor} select[name='${tmp_name}'] option[value='${objeto[tmp_name]}']` );
                if( temp_element ) {
                    temp_element.setAttribute('selected','');
                }
            break;
            case 'textarea': 
                let texto = objeto[tmp_name] || ''
                texto     = texto.replace(/\\/gi, '')       
                formulario[i].innerHTML = texto;
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

const hidden = seletor => { query( seletor ).setAttribute( 'hidden', '' ) };

function dowload_csv(  array_de_array, file_name )
{
    let elemento      = document.querySelector( "#link_baixar" );
    let content_type  = `data:text/csv;charset=utf-8,`;
    let data          = array_de_array.map( x => Object.values(x).join(';') ).join("\n");
    data              = encodeURI( data );
    elemento.href     = content_type + data; 
    elemento.download = file_name;
    elemento.click();
}

function baixar_inscritos()
{
    let data  = vio.inscrito || [];
    let dados = data.map( x => [ x.nome || '', x.email || '' ] );
    dowload_csv( '#baixar', dados, "inscritos.csv" );
}

function privado() {
    let url = `auth/?token=${window.localStorage.token_painel || 1}`;
    get_api( encodeURI(url), x => {
        if( !x.token ) {
            window.localStorage.removeItem('token_painel');
            to( `${admin}/#entrar` );
        }
    } );
}

function publico()
{
    if( window.localStorage.token_painel ) {
        // to( `${admin}/dash.html#agenda` );
    }
}

function login( seletor )
{
    let data = form_data( seletor );
    post_api( 'auth', {...data, login : 1 }, x => {
        if( x.login ) {
            window.localStorage.setItem( 'token_painel', x.token );
            query( `#${seletor}` ).reset();
            to( `${admin}/dash.html#agenda` );
        } else {
            alerta( 'Usuário ou senha errado' );
        }
    } );
}

function logout() {
    window.localStorage.removeItem('token_painel');
}

function recuperar_senha()
{
    let data = form_data( 'recuperar-senha' );
    post_api( 'auth', { 'recuperar-senha': 1, ...data }, x => {
        alerta( 'Nova Senhar Enviada por email' );
        query( '#recuperar-senha' ).reset();
    } );
}

function previwew_img( ID, ID_PREVIEW, ID_PREVIEW_2 = null )
{
    let input     = query( `#${ID}` );
    let nome      = input.name || 'default';
    let preview   = query( `#${ID_PREVIEW}` );
    if (input.files && input.files[0])
    {
        let reader             = new FileReader();
        reader.onload          = ( e ) =>  {
            let img            = e.srcElement.result;
            files[nome]        = window.btoa(img);
            preview.src        = img;
            if( ID_PREVIEW_2 != null ) {
                query(`#${ID_PREVIEW_2}`).src = img;
            }
        };           
        reader.readAsDataURL( input.files[0] );
    }        
}

function params() {
    let param = window.location.search.replace('?', '') || '';
    param = param.split('&').filter( x => x !== '' );        
    let toObject = param.reduce( ( ACC, x )=>{
        let part = x.split('=');
        ACC[ part[0] ] = decodeURI( part[1] );
        return ACC;
    }, {} );
    return toObject;
}


function router( pag, HOF ) { if ( page === pag ) { HOF(); } }

function alerta( str ) {
    query( '#show-alerta' ).click();
    query( '#alerta span' ).innerHTML = str;
    setTimeout( x => {
        query( '#show-alerta' ).click();
    }, 2000 );
}

function set_domain( elemento ) {
    let value = elemento.value || '';
    if( value != '' ) {
        to( `${http}//${value}/admin/dash.html#agenda` );
    }
}

function draw_select( arr, name )
{
    let list = queryAll( `select[name='${name}']`);
    let html = arr.map( x => `<option value="${x.id||''}">${x.nome||''}</option>` ).join('');
    for( let i = 0; i < list.length; i++ ) {
        list[i].innerHTML = html;
    }
}

async function upload()
{
    let result = {};
    let loop   = Object.keys( files );
    for( let i = 0; i < loop.length; i++) {
        options.body = encodeURI( `file=${files[loop[i]]}` );
        let aguarde = await fetch( storage, options )
        .then( x => x.json() )
        .then( x => {
            result[loop[i]] = x.name;
        } );
    }
    return result;
}

function send_mail()
{
    let obj = form_data('form-contato');
    options.body = obj_to_url( obj );
    fetch( `${fnc}/mail`, options )
    .then( x => x.json() )
    .then( x => {
        if( x.status ) {
            query('#form-contato').reset();
            alerta('Email enviado com sucesso');
        } else {
            alerta('Não foi possivel enviar o email tente mais tarde');
        }
    } );
}

function tpl_array( arr, seletor, prefix = '' )
{
    if (query( seletor )) {
        let tpl = query( seletor ).innerHTML;
        let html = arr.map( x => {
            x.prefix     = prefix;
            x.uri        = uri;
            x.ativo      = x.ativo == "1" ? 'Sim' : 'Não';
            let tpl_temp = tpl;
            let list     = Object.keys(x);
            for( let i = 0; i < list.length; i++) {
                tpl_temp = tpl_temp.replace( RegExp(`{{${list[i]}}}`,'gi'), x[list[i]]  );
            }
            return tpl_temp;
        } ).join('');
        html = html.replace( /\{\{.*\}\}/gi, '' );
        return html;
    }
    return '';
}

function add_horario() {
    horario.push( {id: time_stemp() } );
    vio.mostrar_horarios = 1;
}
function remove_horario( id ) {
    horario =  horario.filter( x => x.id != id );
    post_api( 'horario', {'id': id, status: 0 }, z => {} );
    vio.mostrar_horarios = 1;
}
function save_horario( elemento, id ) {
    let name  = elemento.name || '';
    let valor = elemento.value || '';
    horario.forEach( x => {
        if( id == x.id && name != '' ) {
           x[name] = valor;
        }
    } );
}

function gravar_horario( id ) {
    if( id.length < 36 ) {
        horario.forEach( x => {
            let obj = {
                id: x.id,
                quadra: id,
                inicio: x.inicio,
                final: x.final,
                status: 1,
                ativo: 1
            };
            post_api( 'horario', obj, z => {
                let horarios =  vio.horario || [];
                horarios = horarios.filter( x => z.id  != x.id  );
                horarios.push( z );
                vio.horario = horarios;
            } );
        } );        
    }
}
function editar_horarios( id ) {
    let times =  vio.horario || [];
    horario = times.filter( x => x.quadra == id );
}
function editar_agenda( id ) {
    let times =  vio.horario || [];
    return times.filter( x => x.quadra == id );
}
function click( id , id_2 = null ) {
    query(`#${id}`).click();
    if( id_2 != null ) {
        query(`#${id_2}`).click();
    }
}

function busca_capiao( e ) {
    let valor = e.value.toLowerCase();
    let arr  = vio._user;
    if( valor.length > 0 ) {
        arr      = arr.filter( x => {
            if( valor != '' && x.nome.toLowerCase().indexOf( valor ) != -1  ) {
                return true;
            } else {
                return  false;
            }
        } );
    }
    let html = arr.map( x => `
        <tr>
            <td>${x.nome}</td>
            <td>${x.telefone}</td>
            <td>
                <label for="cad-finalizar" onclick="set_user_locacao('${x.id}','${x.nome}', '${x.telefone}', '${x.email}')">
                    <img src="./disc/ico/check.png" class="ico-table">
                </label>
            </td>
        </tr>
    ` ).join('');
    query('#lista-de-capitao').innerHTML = html;
}

function set_user_locacao( id, nome, telefone, email ) {
    query('#contratante-id-locacao').value = id;
    query('#contratante-nome-locacao').value = nome;
    query('#contratante-telefone-locacao').value = telefone;
    query('#contratante-email-locacao').value = email;
}

function set_quadra_contratar( id ) {
    query('#id_quadra_contratar').value = id;
    let horario = id.substr(11,5).replace('-', ':') + " - " + id.substr(17,5).replace('-', ':');
    query("#reserva_horario").innerHTML = horario;
    query("#ocupado_horario").innerHTML = horario;
    query("#reserva_data").innerHTML = id.substr( 0,10 ).split('-').reverse().join('/');
    query("#ocupado_data").innerHTML = id.substr( 0,10 ).split('-').reverse().join('/');
}

var _csv = [];
function busca_os_contratante() {

    let ano        = query('#busca-os-ano').value;
    let termo      = query('#termo-os-status').value;
    let status     = query('#busca-os-status').value;
    let mes        = query('#busca-os-mes').value;
    let origem     = query('#busca-os-origen').value;
    let contatacao = query('#busca-os-tipo-contratacao').value;

    calc_balanco( ano, mes )

    let lista = vio.reservas || [];
    _csv      = lista;
    
    let arr   = lista.filter( x => {

        let if_mes           = true
        let if_origem        = true
        let if_contratacacao = true
        let if_termo         = true
        let if_ano           = true
        let if_pago          = true
        let busca            = `${x.contratante_nome} ${x.contratante_Id} ${x.contratante_email}`;

        x.tipocontratacao    = x.tipocontratacao || 0;
        x.site               = x.site || 2;
        if( mes != "0" ) {
            if_mes           = mes == "0" ? true : x.id.indexOf(`-${mes}-`) != -1;
        }
        if( ano != "0" ) {
            if_ano           = ano == "0"  ? true : x.id.indexOf(`${ano}-`)  != -1;
        }
        if( origem != "0" ) {
            if_origem        = x.site == origem;
        }
        if( status != "0" ) {
            if_pago          = x.status_compra == status;
        }
        if( contatacao != "0" ) {
            if_contratacacao = x.tipocontratacao == contatacao;
        }
        if( termo.length > 0 ) {
            if_termo         = termo.length > 1 ? true : busca.indexOf(termo) != -1;
        }
        return if_pago && if_mes && if_origem && if_contratacacao && if_termo && if_ano;
    } );

    _csv = arr;
    query( '#historico__table_body' ).innerHTML = tpl_array( arr, '#tpl_historico' );
}

function calc_balanco( ano, mes ) {
    let { reservas } = vio
    Balanco.itens = reservas
    Balanco.ano( ano )
    Balanco.ano( mes )
    Balanco.render()
    let resultado = Balanco.val()
    $("#b_total_gerado").html(resultado.total)
    $("#b_total_mensalidade").html(resultado.mensalidade)
    $("#b_total_avulso").html(resultado.avulso)
    $("#b_total_devido").html(resultado.devido)
    $("#b_total_pago").html(resultado.pago)
}

function query_cep( elemento, seletor = null ) {
    let cep   = elemento.value || '';
    cep       = cep.replace( /\-/gi, '' );
    
    let total = cep.length;
    if( total == 8 ) {
        fetch( `https://viacep.com.br/ws/${cep}/json/` )
        .then( x => x.json() )
        .then( x => {
            let obj = x;
            obj.id = 'endereco';
            obj.rua = x.logradouro || '';
            obj.bairro = x.bairro || '';
            obj.cidade = x.localidade || '';
            obj.estado = x.uf || '';
            if( seletor == null ) {
                preencher( 'form-endereco', { ...edit, ...obj, id: edit.id } );
            } else {
                let form = form_data( seletor );
                preencher( seletor, { ...form, ...edit, ...obj, id: form.id  } );
            }
        } )
        
    }
}

function lista_espera() {
    let lista  = vio.espera || [];
    let select = query('#espera-modalidade').value;
    let input  = query('#espera-termo').value;
    lista = lista.filter( ( x ) => {
        let keys   = Object.keys(x);
        keys   = keys.map( c => c.replace('mod_', '') );
        let valid  = keys.indexOf(select);
        return valid != -1 ? true : false;
   });
   vio.jogadores = lista;
}
function delete_dominio( id ) {
    trash( 'dominio', id );
}

function delete_usuario( id, mail ) {
    post_api('auth', { update: 1, status:0, bug: 1, email: mail }, x => {
        vio.usuario = _vio.usuario.filter( y => x.email != y.email );
    })
}

function parcial() 
{
    query("#table_os_parcial").innerHTML = tpl_array( _parcial, "#tpl_os_parcial");
    total_parcial();
    query("#ui-falta").innerHTML = _parcial_data.sub;
    query("#ui-total").innerHTML = _parcial_data.total;
}

function add_parcial()
{
    let obj = form_data( 'form-parcial' );
    obj     = {...obj, id: time_stemp(), quadra: request.id, status: 1 };
    _parcial.push(obj);
    
    query("#form-parcial").reset();
    alerta('Adicionado com sucesso');
    parcial();
    post_api('parcial', obj, x => {} );
}

function total_parcial() {
    // { sub:"00,00", total: "00,00" };
    let total = _parcial_data.total.replace(',','.');
    let sub   = _parcial.reduce( (acc, e ) => { 
        let valor = e.valor.replace(',','.');
        valor = valor == "00.00" ? 0 : valor;
        acc = eval( `${+acc} + ${+valor}` )
        return acc;
    }, 0 );  
    let falta = eval(` ${sub} - ${total}`);
    _parcial_data.sub  = falta.toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
}

function remove_parcial( id )
{
    _parcial = _parcial.filter( x => x.id != id );
    alerta('Removido com sucesso');
    trash( 'parcial', id );
    parcial();
}

function reset_form( seletor ) {
    let btnReset = query(`${seletor} [type="reset"]`);
    if( btnReset ) { btnReset.click(); }        
    let editor   = query( `${seletor} .editor-local` );
    if( editor ) { editor.innerHTML = ''; }
    queryAll( `${seletor} textarea` ).forEach( x => { x.innerHTML = ""; } );
    queryAll( `${seletor} option` ).forEach( x => { x.removeAttribute("selected"); } );
    queryAll( `${seletor} [type="checkbox"]` ).forEach( x => { x.removeAttribute("checked"); } );
    queryAll( `${seletor} [type="radio"]` ).forEach( x => { x.removeAttribute("checked"); } );
    queryAll(`${seletor} img:not([src*="/ico"])`).forEach( x => { x.src = 'disc/img/default.jpg'; } );
    let id_post = query( `${seletor} [name="id"]` );
    if(id_post) { id_post.value = ""; }     
}

function saveSession( nomeSession ) {
    localStorage.setItem( 'sessionSite', nomeSession )
}

function evidenciaSession() {
    let paginaAtual = window.location.hash
    let listaLinks  = queryAll( "#nav a" ) 
    listaLinks.forEach( x => {
        x.classList.remove('ativo')
    } )
    let sessionSite = query( `#nav [href="${paginaAtual}"]` )
    if( sessionSite ) {
        sessionSite.classList.add( 'ativo' )
    }
}

function removerReserva() {
    let link = query("#remover_reserva")
    let id   = request.id || ''
    if( id ) {
        link.setAttribute('onclick', `trash( 'reservas', '${id}', () => {window.close()} )`)
    }
}

function mensalidadeMensal(diaSemana) {
    let data = new Date();
    let quantidade_dias_mes = [0, 31, 28, 31, 30, 31, 30, 31, 30, 31, 30, 31, 30];
    let mes = data.getMonth() + 1;
    let ano = data.getFullYear();
    let dias = [];
    let meses = [];
    for (let index = mes; index < 13; index++) {
        meses.push(`${index}`);
    }
    meses.forEach(e => {
        for (let index = 1; index <= quantidade_dias_mes[e]; index++) {
            dias.push(`${ano}-${duasCasas(e)}-${duasCasas(index)}`);
        }
    });
    return dias.filter(x => {
        let d = new Date(x);
        return d.getDay() + 1 == diaSemana;
    });
}

function agendarMensal(diaSemana, idQuadra, horarioInicial, horarioFinal) {
    let idBase = mensalidadeMensal(diaSemana);

    return idBase.map(x => `${x}-${horarioInicial.replace(':', '-')}-${horarioFinal.replace(':', '-')}-${diaSemana}-${idQuadra}`);
}

function duasCasas(data) {
    data = data + '';
    return (data.length == 1) ? '0' + data : data;
}

function baixar_balanco() {

    let csvFiltrado = _csv.map( cs => ( {
        contratante: cs.contratante_nome,
        contratanteEmail: cs.contratante_email,
        data: cs.data,
        tipoContratacao: cs.tipo_contatacao == "1" ? "Avulso" : "mensal",
        statusCompra : cs.status_compra == "2" ? "Pago" : "Nao pago",
        valor: cs.valor
    } ) );

    let data = new Date( _csv[0].id.substr(0, 10) )
    let meses_anos = mes.map( el => el.nome )

    let somas = Balanco.val()
    
    csvFiltrado = [ {
        contratante: "CONTRATANTE",
        contratanteEmail: "EMAIL",
        data: "DATA",
        tipoContratacao: "MENSAL/AVULSO",
        statusCompra : "PAGO/NAO PAGO",
        valor: "VALOR R$"
    },...csvFiltrado, 
    { pulo: ''},
    { pulo: ''},
    {
        ano: _csv[0].id.substr(0,4),
        mes: meses_anos[data.getMonth()],
        total: `Total ${somas.total}`,
        mensalidade: `Mensalista ${somas.mensalidade}`,
        avulso:`Avulso ${somas.avulso}`,
        valorDevido: `Valor Devido ${somas.devido}`,
        valorPago: `Valor Pago ${somas.pago}`
    } ]

    dowload_csv(  csvFiltrado, 'lista.csv' )
}

function masc( el, pattern ) {
    let value   = el.value
    let misterX = pattern.replace(/9/g, 'x')
    let max     = pattern.replace( /\D/gi, '' )
    value       = value.replace( /\D/gi, '' )
    el.setAttribute( 'maxlength', misterX.length )
    if( value.length <= max.length && value.length > 0) {
        value.split('').forEach( x => {
            let index      = misterX.indexOf('x')
            misterX        = misterX.split('')
            misterX[index] = x
            misterX        = misterX.join('')
        } )
        let ultimo         = misterX.split('').reverse().join('').search(/\d/)
        ultimo             = misterX.length - ultimo
        value              = misterX.substr(0,ultimo)
    }
    el.value = value
}