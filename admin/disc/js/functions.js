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
        nome  = formulario[i].name || formulario[i].id || false;
        valor = formulario[i].value || formulario[i].innerHTML || '';
        if( nome ) {
            data[nome] = valor;
        }
    }
    if( html.length > 0 ) {
        html      = html.replace(/"/gi, '\"')
        data.html = html;
    }
    data.pass     = data.pass || ''
    data.password = data.password || ''
    if( data.pass.length  < 3 ) delete data.pass
    if( data.password.length  < 3 ) delete data.password
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
    formulario.os     = new Date().getTime()
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
        let ListaReservaMensal = agendarMensal( tradaDia, idQuadra, inicioHs, finalHs, formulario.id.substr(0,10)  )
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
    objeto.create        = 1;
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

function semana( diat, data )
{
    let result = [];
    let hoje = new Date(data);
    let dia = (hoje.getDay() == 6) ? 0 : hoje.getDay() + 1;
    let [ano, mes, diaMes] = data.split('-');
    let quandidade_dias_mes = [0, 31, 28, 31, 30, 31, 30, 31, 30, 31, 30, 31, 30];
    let futuro = +diaMes;
    let passado = +diaMes - 1;
    let mesPassado = +mes;
    for (let index = dia - 1; index > -1; index--) {
        if (passado <= 1) {
            mesPassado = +mes - 1;
        }
        passado = (passado <= 0) ? quandidade_dias_mes[+mesPassado] : passado;
        result[index] = `${ano}-${duasCasas(mesPassado)}-${duasCasas(passado)}`;
        passado--;
    }
    for (let index = dia; index < 7; index++) {
        if (futuro > quandidade_dias_mes[+mes]) {
            futuro = 1;
            mes = +mes + 1;
        }
        if (mes > 12) {
            mes = 1;
            ano++;
        }
        result[index] = `${ano}-${duasCasas(mes)}-${duasCasas(futuro)}`;
        futuro++;
    }

    result[dia] = data;
    return result;
}
function quadra_em_edicao( id ) {
    queryAll(`[class*="ativa_quadra_"]`).forEach( x => x.classList.remove('ativa') );
    let quadra_a_ativar = query(`[class*="ativa_quadra_${id}"]`);
    if( quadra_a_ativar ) {
        quadra_a_ativar.classList.add('ativa');
    }
}
var quadraAtivaId = ''
function edita_quadra( id ) {
    quadraAtivaId = id
    query('#agenda_contador span').innerHTML = 0;   
    // horario = [];
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
            if( !elementor.classList.contains( 'agenda-ocupado' ) ) {

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
                        <i>${x.tipo_contatacao == 1 ? 'Avulso' : 'Mensal'}</i>
                    </span> 
                `;            
            }
        }
    } );
}

async function atualizaAgenda( id ) {
    

    let chamaHttp = await fetch( `${app}/reservas` )
    let reservas  = await chamaHttp.json()
    reservas      = reservas.filter( re => re.id.indexOf( id ) != -1 )

    
    reservas.forEach( x => {
        let elementor = query(`#b${x.id}`);        
        if( elementor ) {
            if( !elementor.classList.contains( 'agenda-ocupado' ) ) {
                elementor.setAttribute('for',"pop-agenda-ocupado");           
                elementor.classList.add('agenda-ocupado');
                elementor.innerHTML = `
                    <span class="descktop" onclick="pop_ocupado('${x.id}')">
                        <b></b>
                        <i>${x.tipo_contatacao == 1 ? 'Avulso' : 'Mensal'}</i>
                    </span> 
                `;            
            }
        }
    } );
}

function reset_pop_ocupado() {}

async function pop_ocupado( id ) {
    let horario = id.substr(11,5).replace('-', ':') + " - " + id.substr(17,5).replace('-', ':');
    query("#ocupado_horario").innerHTML = horario || '';
    let chamda  = await fetch( `${app}/reservas?id=${id}` )
    let reserva = await chamda.json()
    query("#v-ocupado-nome").innerHTML = `<a href="dash.html?editarContrante=${reserva.contratante}#contratante" target="_blank">${reserva.contratante_nome || ''}</a>`;
    query("#v-ocupado-telefone").innerHTML = reserva.whatsapp || reserva.contratante_telefone || '' ;
    query("#v-ocupado-contratacao").innerHTML = reserva.tipo_contatacao == "1" ? "Avulso" : "mensal"; 
    query("#v-ocupado-pagamento").innerHTML = statusCompra[ reserva.status_compra || 1 ];
    query("#v-ocupado-link").setAttribute('href',`${uri}/admin/dash.html?id=${id}#os` );
    query("#reserva_dia").innerHTML = semana_print[ id.substr(23,1) ];
    query("#ocupado_dia").innerHTML = semana_print[ id.substr(23,1) ];
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
    let data          = array_de_array.join("\n");
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
            x.prefix      = prefix;
            x.uri         = uri;
            x.ativo_print = x.ativo == "1" ? 'Sim' : 'Não';
            let tpl_temp  = tpl;
            let list      = Object.keys(x);
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
    id = id || '1'
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
            <td>${x.whatsapp}</td>
            <td>
                <label for="cad-finalizar" onclick='set_user_locacao("${JSON.stringify(x).replace(/\"/gi, "\\\"")}")'>
                    <img src="./disc/ico/check.png" class="ico-table">
                </label>
            </td>
        </tr>
    ` ).join('');
    query('#lista-de-capitao').innerHTML = html;
}

function set_user_locacao( json ) {
    let {id, nome, telefone, email, cpf_cnpj, whatsapp ,acrescimo, acrescimoValor} = JSON.parse( json )
    query('#contratante-id-locacao').value = id;
    query('#contratante-nome-locacao').value = nome;
    query('#contratante-telefone-locacao').value = telefone;
    query('#contratante-email-locacao').value = email;
    query('#contratante-cpf-cnpj-locacao').value = cpf_cnpj;
    query('#contratante-whatsapp-locacao').value = whatsapp;
    query('#acrescimo').value = acrescimo;
    query('#acrescimoValor').value = acrescimoValor;
}
function setValorReserva() {
    let idQuadra =  query('#id_quadra_contratar').value.split('-').reverse()[0]
    let quadra   = _vio.quadra.find( arena => arena.id == idQuadra )
    let tipo     =  query('#contratante-mensal-avulso').value
    let indice   = tipo == "1" ? 'diaria' : 'mensalidade'
    query('#contratante-preco').value = quadra[indice]
}
function set_quadra_contratar( id ) {
    let quadra = vio.quadra.find( x => x.id == id.split('-').reverse()[0] )
    query('#id_quadra_contratar').value = id;
    query('#quadra_nome').value = quadra.nome;
    query('#dia_compra').value = id.substr(8,2);
    let horario = id.substr(11,5).replace('-', ':') + " - " + id.substr(17,5).replace('-', ':');
    query("#contratante-inicio").value = id.substr(11,5).replace('-', ':');
    query("#contratante-final").value  = id.substr(17,5).replace('-', ':'); 
    query("#ocupado_horario").innerHTML = horario;
    query("#reserva_data").innerHTML = id.substr( 0,10 ).split('-').reverse().join('/');
    query("#ocupado_data").innerHTML = id.substr( 0,10 ).split('-').reverse().join('/');
}

var _csv = [];
function busca_os_contratante() {

    BalancoFiltro.ano               = Number( query('#busca-os-ano').value )
    BalancoFiltro.mes               = Number( query('#busca-os-mes').value )
    BalancoFiltro.statusPagamento   = Number( query('#busca-os-status').value )
    BalancoFiltro.site              = Number( query('#busca-os-origen').value )
    BalancoFiltro.tipoContratacao   = Number( query('#busca-os-tipo-contratacao').value )
    BalancoFiltro.termo             = query('#termo-os-status').value
    BalancoFiltro.init()
    _csv                            = BalancoFiltro.csv;

    calc_balanco()
    query( '#historico__table_body' ).innerHTML = tpl_array( BalancoFiltro.print, '#tpl_historico' );
}

function calc_balanco() {
    $("#b_total_gerado").html(BalancoFiltro.resultado.total.toFixed(2).toString().replace('.',','))
    $("#b_total_mensalidade").html(BalancoFiltro.resultado.mensal.toFixed(2).toString().replace('.',','))
    $("#b_total_avulso").html(BalancoFiltro.resultado.avulso.toFixed(2).toString().replace('.',','))
    $("#b_total_devido").html(BalancoFiltro.resultado.devido.toFixed(2).toString().replace('.',','))
    $("#b_total_pago").html(BalancoFiltro.resultado.pago.toFixed(2).toString().replace('.',','))    
}

function query_cep( elemento, seletor = null ) {
    let cep   = elemento.value || '';
    cep       = cep.replace( /\-/gi, '' );
    
    let total = cep.length;
    if( total == 8 ) {
        fetch( `https://viacep.com.br/ws/${cep}/json/` )
        .then( x => x.json() )
        .then( x => {
            let obj      = x;
            obj.id       = 'endereco';
            obj.endereco = x.logradouro || '';
            obj.bairro   = x.bairro || '';
            obj.cidade   = x.localidade || '';
            obj.estado   = x.uf || '';
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
    let typeTributo = Number( _reservas.acrescimo || 1 )
    _parcial = _parcial.map( payment => ( {...payment, dia_print: payment.dia.split('-').reverse().join('/') } ) )
    query("#table_os_parcial").innerHTML = tpl_array( _parcial, "#tpl_os_parcial");
    total_parcial();
    query("#ui-falta").innerHTML         = _parcial_data.sub;
    query("#ui-total").innerHTML         = _parcial_data.total;
    query("#ui-label-total").innerHTML   = typeTributo  == 1 ? 'VALOR DESCONTO' : 'VALOR ACRESCIMO';
    query("#ui-total-tributo").innerHTML = _reservas.acrescimoValor || '0,00';
    query("#ui-sub-total").innerHTML     = somaMoney( _parcial_data.total, _reservas.acrescimoValor || '0,00', typeTributo );
}
function somaMoney( a, b, n = 2 ) 
{
    a = toFloat( a )
    b = toFloat( b )
    b = n == 1 ? -b : b
    let soma = a + b
    return soma.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
}
function toFloat( str ) 
{
    str =  str.replace( '.', '' )
    str =  str.replace( ',', '.' )
    return Number(str)
}

function add_parcial()
{
    let obj = form_data( 'form-parcial' );
    obj     = {...obj, id: time_stemp(), quadra: request.id, status: 1 };
    _parcial.push(obj);
    
    query("#form-parcial input[type=text]").value = '';
    alerta('Adicionado com sucesso');
    parcial();
    post_api('parcial', obj, x => {} );
}

function total_parcial() {
    // { sub:"00,00", total: "00,00" };
    let typeTributo = Number( _reservas.acrescimo || 1 )
    let init   = somaMoney( '0,00', _reservas.acrescimoValor || '0,00', typeTributo )
    init       = init.replace('-','');
    init       = toFloat( init.replace( 'R$', '' ) )
    let total2 = _parcial_data.total.replace(',','.');
    let sub    = _parcial.reduce( (acc, e ) => { 
        let valor = e.valor.replace(',','.');
        valor = valor == "00.00" ? 0 : valor;
        acc   = eval( `${+acc} + ${+valor}` )
        return acc;
    }, 0 );
    if(_reservas.acrescimo == 1) {
        let falta = eval(`${total2} - ${init} - ${sub}`);
        _parcial_data.sub  = falta.toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
    }else{
        let falta = eval(`${total2} + ${init} - ${sub}`);
        _parcial_data.sub  = falta.toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
    }
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

function mensalidadeMensal(diaSemana, diaCompra) {
    let data = new Date( diaCompra );
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
        if ( d.getTime() >= data.getTime() ) {
            return d.getDay() + 1 == diaSemana;
        }
        return false;
    });
}

function agendarMensal(diaSemana, idQuadra, horarioInicial, horarioFinal, diaCompra ) {
    let idBase = mensalidadeMensal(diaSemana, diaCompra);

    return idBase.map(x => `${x}-${horarioInicial.replace(':', '-')}-${horarioFinal.replace(':', '-')}-${diaSemana}-${idQuadra}`);
}

function duasCasas(data) {
    data = data + '';
    return (data.length == 1) ? '0' + data : data;
}

function baixar_balanco() {
    dowload_csv(  _csv, 'lista.csv' )
}

function masc( el, pattern, limit = true ) {
    let value   = el.value
    let misterX = pattern.replace(/9/g, 'x')
    let max     = pattern.replace( /\D/gi, '' )
    value       = value.replace( /\D/gi, '' )
    if( limit ) {
        el.setAttribute( 'maxlength', misterX.length )
    }
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

function localizar_contratante() {
    let termo = query("#localizar_contratante_termo").value.toLowerCase()
    // if( termo.length > 3 ) {
        fetch( `${app}/_user` )
        .then( x => x.json() )
        .then( contratantes => {
            let filtrado = contratantes.filter( usuario => {
                let frase = `${usuario.nome} ${usuario.cpf_cnpj} ${usuario.telefone} ${usuario.whatsapp}`.toLowerCase();
                return frase.indexOf( termo ) != -1 ? true : false
            } )
            filtrado = filtrado.map(q => ({...q, acrescimoPrint: q.acrescimoValor?'Sim':'Não'}));
            query('#capitao__table_body').innerHTML = filtrado.map( x => `
                <tr>                
                    <td>${x.nome || ''}</td>
                    <td>${x.whatsapp || x.celular || x.telefone || ''}</td>
                    <td>${x.cpf_cnpj || ''}</td>
                    <td>${x.acrescimoPrint}</td>
                    <td>
                        <img onclick="editar( '_user', '${x.id}', 'form-contratante', 'dash.html?editarContrante=${x.id}#contratante' )" src="./disc/ico/edit.png" class="ico-table">
                    </td>
                    <td><img onclick="trash( '_user', '${x.id}' )" src="./disc/ico/trash.png" class="ico-table"></td>
                </tr>
            ` ).join( '' );
        } )
    // }
}
function clone( el, id ) {
    query( id ).innerHTML = el.value
}
function cloneChange( el, id ) {
    query( `${id} option[value='${el.value}']` ).selected = true
}

function contribuiu(idOS, idJogador) {
    if (_pagos.indexOf(`${idJogador}`) == -1) {
        _pagos = _pagos + `,${idJogador}`;
    } else {
        _pagos = _pagos.replace(`,${idJogador}`, '');
    }
    let obj = { id: idOS, pagos: _pagos };
    post_api('reservas', obj, x => { });
}

let _listaJogadores = [];

function addJogador() {
    let time = _listaJogadores || [];
    time.forEach(e => {
        e.status = 1;
        post_api('time', e, x => {
            timeInner(x);
        });
        alerta('Jogador adicionado com sucesso!');
        query('#add-jogador').reset();
    });
}

function add_player() {
    _listaJogadores.push({
        nome: query('#player_name').value,
        tel: query('#player_tel').value,
        email: query('#player_mail').value,
        id: time_stemp(),
        id_contratante: _reservas.contratante_email,
        status: 1,
        presenca: 0,
        obs: ''
    });
    addJogador();
}

var _meu_time = [];

function timeInner(obj) {
    let meu_time = vio.time;
    let pagantes = _reservas.pagos || ''
    meu_time = [...[obj], ...meu_time];
    meu_time = meu_time.filter(player => player.id_contratante == _reservas.contratante_email)
    pagantes = pagantes.split(',') || []
    pagantes = pagantes.filter(x => x.length > 7) || []
    meu_time = meu_time.map(x => {
        let check = ""
        if (pagantes.indexOf(x.id) != -1) {
            check = "checked"
        }
        return {
            ...x,
            check,
            reserva: _reservas.id
        }
    })
    query("#table_time_os").innerHTML = tpl_array(meu_time, "#tpl_time_os");
}

const trash__bombom = (url, id_no) => {
    post_api(url, { id: id_no, status: 0 }, x => {
        _meu_time = _meu_time.filter(y => y.id != id_no);
        query( "#table_time_os" ).innerHTML = tpl_array( _meu_time, "#tpl_time_os" );
        alerta('Jogador removido com sucesso!');
    })
};

function autoSaveBombom(url, no, valor, indice) {
    let obj = { id: no };
    obj[indice] = valor.value || valor.innerHTML;
    obj[indice] = (obj[indice].length == 0) ? 'obs' : obj[indice];
    post_api(url, obj, x => { });
}