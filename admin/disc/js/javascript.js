"use strict";
if( localStorage.sistema == '' ) {
    beta.sistema = true;
}else {
    beta.sistema = false;
}
get( 'dominio', '', x => {
    beta.dominio = x; 
    beta.usuario_novo = { domain: x };
} );

get( 'auth', '', x => {
    beta.usuario = x; 
} );

get( 'error', '', x => {
    beta.registro_problema = x; 
} );

get( 'auth', {profile: localStorage.jwt_token }, x => {
    beta.perfil = x; 
    beta.admin = x.admin == "2" ? true : false;
    let quadra = beta.dominio.find( y => y.id == x.domain );
    let seletor = `#selecionar-dominio option[value='${dominio}']`;
    if( query( seletor ) ){
        query( seletor ).setAttribute( 'selected', '' );
    }
    if( dominio != quadra.domain ) {
        to( `//${quadra.domain}/${name_panel}/dash` );
    }
} );

