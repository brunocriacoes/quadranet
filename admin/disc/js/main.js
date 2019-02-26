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
    x.pagina = x.pagina || [];
    x.info   = x.info || [];
    preencher( 'visual__form__info', x.site.find( y => y.id == 'info' ) || { id: 'info' } );
    preencher( 'visual__form__social', x.site.find( y => y.id == 'info' ) || { id: 'info' } );
    preencher( 'visual__form__contato', x.site.find( y => y.id == 'info' ) || { id: 'info' } );
    preencher( 'visual__form__pag', x.site.find( y => y.id == 'pagseguro' ) || { id: 'pagseguro' } );
    preencher( 'servicos_form__quem-somos', x.pagina.find( y => y.id == 'sobre' ) || { id: 'sobre' } );
    preencher( 'servicos_form', x.pagina.find( y => y.id == 'servico' ) || { id: 'servico' } );
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
var estado = [
    { id: "AC", nome: "Acre"},
    { id: "AL", nome: "Alagoas"},
    { id: "AP", nome: "Amapá"},
    { id: "AM", nome: "Amazonas"},
    { id: "BA", nome: "Bahia"},
    { id: "CE", nome: "Ceará"},
    { id: "DF", nome: "Distrito Federal"},
    { id: "ES", nome: "Espírito Santo"},
    { id: "GO", nome: "Goiás"},
    { id: "MA", nome: "Maranhão"},
    { id: "MT", nome: "Mato Grosso"},
    { id: "MS", nome: "Mato Grosso do Sul"},
    { id: "MG", nome: "Minas Gerais"},
    { id: "PA", nome: "Pará "},
    { id: "PB", nome: "Paraíba"},
    { id: "PR", nome: "Paraná"},
    { id: "PE", nome: "Pernambuco"},
    { id: "PI", nome: "Piauí"},
    { id: "RJ", nome: "Rio de Janeiro"},
    { id: "RN", nome: "Rio Grande do Norte"},
    { id: "RS", nome: "Rio Grande do Sul"},
    { id: "RO", nome: "Rondônia"},
    { id: "RR", nome: "Roraima"},
    { id: "SC", nome: "Santa Catarina"},
    { id: "SP", nome: "São Paulo"},
    { id: "SE", nome: "Sergipe"},
    { id: "TO", nome: "Tocantins"},
];
draw_select( tipo_error, 'tipo_error' );
draw_select( sim_nao, 'ativo' );
draw_select( is_admin, 'admin' );
draw_select( estado, 'estado' );


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
    vio.dominio = x;
} );

fetch( `${app}/error` )
.then( x => x.json() )
.then( x => {
    vio.error = x;
} );

fetch( `${app}/auth` )
.then( x => x.json() )
.then( x => {
    vio.usuario = x;
} );
