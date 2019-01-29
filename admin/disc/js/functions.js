"use strict";

const log      = console.log;
const table    = console.table;
const query    = x => document.querySelector(x);
const queryAll = x => document.querySelectorAll(x);
const to       = url => { window.location.href = url; };

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

function obj_to_url( OBJ ) {
    let keys = Object.keys( OBJ );
    let url  = keys.map( x => `${x}=${OBJ[x]}` ).join('&');
    url      = encodeURI( url );
    return url;
}

function get( URL, DATA, HOF )
{
    let data       = obj_to_url( DATA );
    let url_base   = encodeURI( `${api}/${URL}?${data}` );
    fetch( url_base )
    .then( y => y.json() )
    .then( x => {
        HOF( x );
    } );
}

function post( URL, DATA, HOF )
{
    let url_base   = encodeURI( `${api}/${URL}/` );
    options.method = 'POST';
    options.body   = obj_to_url( DATA );
    fetch( url_base, options )
    .then( y => y.json() )
    .then( x => {
        HOF( x );
    } );
}

function form_data( ID )
{
    if( query( ID ) ) {
        let form = query( ID );
        let data = {};
        for( let i = 0; i < form.length; i++ )
        {
            let name  = form[i].name || form[i].id || '';
            let value = form[i].value || form[i].innerHTML || '';
            if( name !=  '' && value != '' ) {
                data[ name ] = value || '';
            }
        }
        return data;
    } else {
        return {};
    }
}

function desable( ID )
{}

function abilite( ID )
{}

function getFile( ID, ID_PREVIEW, ID_PREVIEW_2 = null )
{
    let name_temp = ID.replace( '#', '' );
    let input     = query( ID ); 
    let preview   = query( ID_PREVIEW );
    if (input.files && input.files[0])
    {
        let reader           = new FileReader();
        reader.onload        = ( e ) =>  {
            let img          = e.srcElement.result;
            files[name_temp] = window.btoa(img)
            preview.src      = img;
            if( ID_PREVIEW_2 != null ) {
                query( ID_PREVIEW_2 ).src = img;
            }
        };           
        reader.readAsDataURL(input.files[0]);
    }
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

function publico() {
    get( 'auth', { token }, x => {
        let token = x.token || false;
        if( token ) {
            to( `${http}//${dominio}/${name_panel}/dash.html` );
        } else {
            query('#pisca').style.display = 'grid';
        }
    } );
}

function privado() {
    get( 'auth', { token }, x => {
        let token = x.token || false;
        if( ! token ) {
            to( `${http}//${dominio}/${name_panel}/` );
        } else {
            query('#pisca').style.display = 'grid';
        }
    } );
}

function login( ID ) {
    let data      =  form_data( ID );
    let parametro = { login: `${data.mail},${data.pass}` }
    post( 'auth', parametro, x => {
        let valid = x.login || false;
        if( valid ) {
            localStorage.jwt_token = x.token;
            to( `${http}//${dominio}/${name_panel}/dash.html` );
        } else {
            alerta( 'Usuário ou senha estão errados' );
        }
    } );
}

function create_dominio( ID )
{
    let data       = form_data( ID );
    data['domain'] = data.domain.replace('www.','');
    post( 'dominio', data, x => {
        get( 'dominio', '', x => {
            beta.dominio = x;
            beta.usuario_novo = { domain: x };
            beta.dominio_novo = { id: ''};
            query( ID ).reset();
            to('#dominio');
        } );
    } );
}

function delete_dominio( ID )
{
    let data       = { id: ID, status: 0 };
    post( 'dominio', data, x => {
        get( 'dominio', '', x => {
            beta.dominio = x;
            beta.usuario_novo = { domain: x };
            to('#dominio');
        } );
    } );
}

function edite_dominio( ID )
{
    let edit = beta.dominio.find( x =>  x.id == ID  );
    beta.dominio_novo = edit;
}

function create_usuario( ID ) {
    let data = form_data( ID );
    data = { ...data, create: `${data.mail},${data.pass}`};
    query('#usuario-novo__label_pass').style.display =  'block';
    query('#usuario-novo__form_pass').style.display =  'block';
    post( 'auth', data, x => {
        get( 'auth', '', x => {
            beta.usuario = x; 
            query( ID ).reset();
        } );
        to('#usuario');
    } );
}

function edit_usuario( ID ) {
    get( 'auth', '', x => {
        query('#usuario-novo__label_pass').style.display =  'none';
        query('#usuario-novo__form_pass').style.display =  'none';
        beta.usuario_novo =  x.find( x => x.id == ID );
    } );
}
function delete_usuario( ID ) {
    post( 'auth', { status: 0, mail: ID, create: 1 }, x => {
        get( 'auth', '', x => {
            beta.usuario = x; 
        } );
    } );
}

function save_perfil( ID ) {
    let data = form_data( ID );
    post( 'auth', { ...data, create: 1 }, x => {
        alerta('atualizado com sucesso');
    } );
}

function alter_pass( ID ) {
    let data = form_data( ID );
    post( 'auth', { ...data, mail: beta.perfil.mail, create: 1 }, x => {
        query( ID ).reset();
        alerta('senha aalterada com sucesso');
    } );
}

function logout()
{
    localStorage.jwt_token = '';
    to( `${http}//${dominio}/${name_panel}` );
}

function duplicar( ID ) {
    let edit =  query( `#editor-content-${ID}` ).innerHTML;
    query( `#${ID}` ).innerHTML = edit;
}

async function gravarDados( ID, URL, redirect ) {
    let dados = form_data( ID );
    let send  = await sendImage();
    let all = {...dados, ...send};
    post( `${URL}`, all, x => {
        let info = obj_to_url( x );
        to(`${redirect}`);
    } );
}

async function sendImage() {
    var obj = {};
    if ( files.length !== 0 ) {
        let arqui = Object.keys(files);
        for (let index = 0; index < arqui.length; index++) {
            options.body = encodeURI(`file=${files[arqui[index]]}`);
            var foto = await fetch( url_storage, options )
            .then( j => j.json() )
            .then( x => {
                obj[arqui[index].split( '__' )[1]] = x.name;
            } );
        }
    }
    return obj;
}
