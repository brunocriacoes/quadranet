"use strict";

window.onpopstate = function() {
    // search = params();
    // page   = window.location.hash.replace('#', '');
}

day = hoje();

fetch( `${app}` )
.then( j => j.json() )
.then( x => {
    let lista =  Object.keys( x );
    lista.forEach( e => {
        vio[e] = x[e];
    } );
} );

var tipo_error = [
    { id: '1', nome: "Dica"},
    { id: '2', nome: "Relatar error"},
    { id: '3', nome: "Dúvida"},
    { id: '4', nome: "Suporte"},

];
var sim_nao = [
    { id : "1", nome: "Sim" },
    { id : "0", nome: "Não" },
];
var is_admin = [
    { id: "1", nome: "Usuário"},
    { id: "2", nome: "Administrador"},
];
draw_select( tipo_error, 'tipo_error' );
draw_select( sim_nao, 'ativo' );
draw_select( is_admin, 'admin' );


fetch( `${app}/auth/?profile=${window.localStorage.token_painel||''}` )
.then( x => x.json() )
.then( x => {
    x.update = 1;
    preencher( 'form-perfil', x );
    preencher( 'form-mudar', x );
} );

fetch( `${app}/dominio` )
.then( x => x.json() )
.then( x => {
    let lista = [...[{ id: '', nome: 'sistema'}], ...x];
    draw_select( lista, 'dominio' );
} );
