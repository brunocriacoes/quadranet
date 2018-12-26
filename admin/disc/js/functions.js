const log      = console.log;
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
    .then( x => x.json() )
    .then( x => {
        HOF( x );
    } )
    .catch( x => {
        HOF( x );
    } );
}

function post( URL, DATA, HOF )
{
    let url_base   = encodeURI( `${api}/${URL}/` );
    options.method = 'POST';
    options.body   = obj_to_url( DATA );
    fetch( url_base, options )
    .then( x => x.json() )
    .then( x => {
        HOF( x );
    } )
    .catch( x => {
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
            if( name !=  '' ) {
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

function getFile( ID, ID_PREVIEW )
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
        };           
        reader.readAsDataURL(input.files[0]);
    }        
}

function set_domain( THIS ) {
    let value = THIS.value || '';
    if( value == '' ) {
        beta.sistema = true;
    } else {    
        to( `${http}//${value}/${name_panel}/dash` );
    }
}

function publico() {
    get( 'auth', { token }, x => {
        let token = x.token || false;
        if( token ) {
            to( `${http}//${dominio}/${name_panel}/dash` );
        }
    } );
}
function privado() {
    get( 'auth', { token }, x => {
        let token = x.token || false;
        if( ! token ) {
            to( `${http}//${dominio}/${name_panel}/` );
        }
    } );
}

function login( ID ) {
    let data      =  form_data( ID );
    let parametro = { login: `${data.mail},${data.pass}` }
    post( 'auth', parametro, x => {
        let valid = x.login || false;
        log(x);
        if( valid ) {
            localStorage.jwt_token = x.token;
            to( `${http}//${dominio}/${name_panel}/dash` );
        } else {
            alerta( 'Usuário ou senha estão errados' );
        }
    } );
}
