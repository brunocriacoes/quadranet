const name_panel  = 'admin';
const nowTime     = new Date().getTime();
const http        = window.location.protocol;
const dominio     = window.location.hostname.replace( 'www.', '' );
const base        = `${http}//${dominio}/${name_panel}`;
const api         = `${http}//${dominio}/app`;
const url_storage = `${http}//${dominio}/api/storage`;

if( localStorage.jwt_token == undefined ){
    localStorage.setItem('jwt_token','');
}
if( localStorage.sistema == undefined ){
    localStorage.setItem('sistema','');
}
const token       = localStorage.jwt_token;
var   day         = '';
var   files       = {};
var   page        = window.location.hash.replace('#', '');
var   search      = {};
var   options     = {
    headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
    credentials: "same-origin",
    method: 'POST',
    mode: 'cors',
    cache: 'default',
    body: null
};
