"use strict";

window.onpopstate = function() {
    // search = params();
    // page   = window.location.hash.replace('#', '');
}


fetch( `${app}` )
.then( j => j.json() )
.then( x => {
    let lista =  Object.keys( x );
    lista.forEach( e => {
        vio[e] = x[e];
    } );
    x.pagina = x.pagina || [];
    x.info   = x.info || [];
    quadra_sisten = x.quadra[0].id;
    edita_quadra( quadra_sisten )
    preencher( 'visual__form__info', x.site.find( y => y.id == 'info' ) || { id: 'info' } );
    preencher( 'visual__form__social', x.site.find( y => y.id == 'info' ) || { id: 'info' } );
    preencher( 'visual__form__contato', x.site.find( y => y.id == 'info' ) || { id: 'info' } );
    preencher( 'visual__form__pag', x.site.find( y => y.id == 'pagseguro' ) || { id: 'pagseguro' } );
    preencher( 'servicos_form__quem-somos', x.pagina.find( y => y.id == 'sobre' ) || { id: 'sobre' } );
    preencher( 'servicos_form', x.pagina.find( y => y.id == 'servico' ) || { id: 'servico' } );
} );


draw_select( tipo_error, 'tipo_error' );
draw_select( sim_nao, 'ativo' );
draw_select( is_admin, 'admin' );
draw_select( estado, 'estado' );
draw_select( status_pagamento, 'status_pagamento' );


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


day = hoje().data_sisten;
query('#set-date').value = day;

setInterval( x => {
    let atual = query('#agenda_contador span');
    if ( +atual.innerHTML > 1 ) {
        atual.innerHTML = +atual.innerHTML - 1;
    } else {
        atual.innerHTML = 0;
    }
    edita_quadra( quadra_sisten );
},100000 );