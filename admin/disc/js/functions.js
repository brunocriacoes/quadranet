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

function edita_quadra( id ) {
    query('#agenda_contador span').innerHTML = 0;   
    horario = [];
    let tmp_quadra = vio.quadra || []
    tmp_quadra     = tmp_quadra[0] || {};
    quadra_sisten = id || tmp_quadra.id || '';
    let data_now  = hoje( day.replace(/\-/gi, '/') );
    let horario_temp = editar_agenda( id );
    to(`${admin}/dash.html#agenda`);
    let quadra     = vio.quadra || [];
    quadra         = quadra.find( x => x.id == id ) || '';
    let modalidade = vio.modalidade || [];
    modalidade     = modalidade.find( x => x.id == quadra.modalidade || '' ) || [];
    query('#agenda__tile').innerHTML       = quadra.nome;
    query('#agenda__modalidade').innerHTML = modalidade.nome || '';
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
                <span class="descktop">
                    <b>${x.contratante_nome}</b>
                    <i>${x.tipo_contatacao == 1 ? 'Diaria' : 'Mensal'}</i>
                </span> 
            `;            
        }
    } );
}

const trash = ( url, id  ) => {
    post_api( url, { 'id': id, status: 0 }, x => {
        vio[url] = _vio[url].filter( x => id != x.id );
    } )
};

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

const hidden = seletor => { query( seletor ).setAttribute( 'hidden', '' ) };

function dowload_csv( seletor, array_de_array, file_name )
{
    let elemento      = document.querySelector( seletor );
    let content_type  = `data:text/csv;charset=utf-8,`;
    let data          = array_de_array.map( x => x.join(',') ).join("\n");
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

function privado()
{
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
        to( `${admin}/dash.html#agenda` );
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

function set_domain( THIS ) {
    let value = THIS.value || '';
    localStorage.sistema = value;
    if( value != '' ) {
        to( `${http}//${value}/${name_panel}/dash` );
    }else {
        beta.sistema = true;
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
            x.ativo      = x.ativo || false ? 'Sim' : 'Não';
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
    let valor = e.value;
    let arr  = vio._user;
    arr      = arr.filter( x => {
        if( valor != '' && x.nome.indexOf( valor ) != -1  ) {
            return true;
        } else {
            return  false;
        }
    } );
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
}

function busca_os_contratante() {
    let e      = query('#termo-os-status');
    let status = query('#busca-os-status').value;
    
    let valor =  e.value;
    let lista = vio.reservas || [];
    lista.forEach( x => {
        if ( !x.status_compra ) {
            x.status_compra = 0;
        }
        let tipo_pagamento = status_pagamento.find( y => y.id == x.status_compra  ) || {};
        x.pagamento        = tipo_pagamento.nome || 'aguardando pagamento';
        let id_quadra      = x.id.substr( 25, 34 );
        let todas_quadra   = vio.quadra || [];
        let qd             = todas_quadra.find( z => z.id == id_quadra );
        if( x.tipo_contatacao == 1 ) {

            x.valor            = qd.diaria || '0,00';
        } else {
            x.valor            = qd.mensalidade || '0,00';
        }
    } );
    log( lista );
    let arr   = lista.filter( x => x.contratante_nome.indexOf(valor) != -1 && status == x.status_compra  );
    query( '#historico__table_body' ).innerHTML = tpl_array( arr, '#tpl_historico' );
}

function query_cep( elemento, seletor = null ) {
    let cep   = elemento.value;
    cep       = cep.replace( /\-/gi, '' );
    let total = cep.length;
    if( total == 8 ) {
        fetch( `https://viacep.com.br/ws/${cep}/json/` )
        .then( x => x.json() )
        .then( x => {
            let obj = x;
            obj.id = 'endereco';
            obj.rua = x.logradouro;
            obj.cidade = x.localidade;
            obj.estado = x.uf;
            if( seletor == null ) {
                preencher( 'form-endereco', { ...edit, ...obj, id: edit.id } );
            } else {
                let form = form_data( seletor );
                preencher( seletor, { ...edit, ...obj, id: edit.id, ...form } );
            }
        } );
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

