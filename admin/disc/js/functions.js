"use strict";

const query      = x => document.querySelector(x);
const queryAll   = x => document.querySelectorAll(x);
const log        = console.log;
const table      = console.table;
const time_stemp = () => new Date().getTime();

const to   = x => { window.location.href = x };
const back = x => { window.history.back() };

function form_data( id ) 
{
    let formulario = queryAll( `#${id} input, #${id} textarea, #${id} select` );
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
        files     = {};
        cart      = [];
        edit      = {};
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
    let data        = vio[url] || [];
    let objeto      = data.find( x => id == x.id ) || {};
    objeto.id       = id;
    edit            = objeto;    
    objeto.update   = 1;
    objeto.pass     = '';
    objeto.password = '';
    if( redirect != null ) {
        to( `${admin}/${redirect}` );
    }
    preencher( formulario, objeto );
};

function edita_quadra( id ) {
    to(`${admin}/dash.html#agenda`);
}

const trash = ( url, id  ) => {
    post_api( url, { 'id': id, status: 0 }, x => {
        vio[url] = _vio[url].filter( x => id != x.id );
    } )
};

function preencher( seletor, objeto )
{
    let formulario = queryAll( `#${seletor} input, #${seletor} textarea, #${seletor} select, #${seletor} img` );
    let lista_var = queryAll(`#${seletor} img:not([src*="editor"])`);
    for (let index = 0; index < lista_var.length; index++) {
        lista_var[index].src = storage + '/' + objeto[lista_var[index].alt || ''] || '';
    }
    let html = objeto.html || '';
    if( html.length > 0 ) {
        if(query( `#${seletor} .editor-box` )) {
            query( `#${seletor} .editor-box` ).innerHTML = objeto.html || '';
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
            break;        
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

function hoje()
{
    let hour = new Date();
    return `${hour.getFullYear()}-${hour.getMonth() + 1}-${hour.getDate()}`;
}

function router( pag, HOF ) { if ( page === pag ) { HOF(); } }

function alerta( str ) {
    query( '#show-alerta' ).click();
    query( '#alerta span' ).innerHTML = str;
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
        return html;
    }
    return '';
}
