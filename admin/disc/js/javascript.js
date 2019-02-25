"use strict";
if( localStorage.sistema == '' ) {
    beta.sistema = false;
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
    quadra = quadra || 1;
    if( query( seletor ) ){
        query( seletor ).setAttribute( 'selected', '' );
    }
    // if( dominio != quadra.domain || 1 && !beta.admin ) {
    //     to( `//${quadra.domain}/${name_panel}/dash` );
    // }
} );

