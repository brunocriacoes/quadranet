"use strict";

const http    = window.location.protocol;
const dominio = window.location.hostname.replace( 'www.', '' );
const uri     = `${http}//${dominio}`;
const app     = `${uri}/app`;
const fnc     = `${app}/fnc`;
const admin   = `${uri}/admin`;
const storage = `${uri}/app/storage`;
const tag     = window.location.hash;
const request = window.location.search.replace('?','').split('&')
.reduce( ( acc, item ) => {
    let data  = item.split('=');
    let valor =  data[1] || '';
    if( valor.length > 0  ) {
        acc[data[0]] = decodeURI( valor );
    }
    return acc;
}, {} );

var options = 
{
    headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
    credentials: "same-origin",
    method: 'POST',
    mode: 'cors',
    cache: 'default',
    body: null
};
 
var day           = '';
var files         = {};
var cart          = [];
var edit          = {};
var horario       = [];
var agenda        = [];
var quadra_sisten = '';

