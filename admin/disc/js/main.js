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
    x.pagina       = x.pagina || [];
    x.info         = x.info || [];
    let tmp_quadra = x.quadra || []
    tmp_quadra     = tmp_quadra[0] || {};
    quadra_sisten  = tmp_quadra.id || '';
    edita_quadra( quadra_sisten );
    x.site   = x.site   || [];
    x.pagina = x.pagina || [];
    let info =  x.site;
    preencher( 'visual__form__info', x.site.find( y => y.id == 'info' ) || { id: 'info' } );
    preencher( 'visual__form__social', x.site.find( y => y.id == 'info' ) || { id: 'info' } );
    preencher( 'visual__form__contato', x.site.find( y => y.id == 'info' ) || { id: 'info' } );
    preencher( 'visual__form__pag', x.site.find( y => y.id == 'pagseguro' ) || { id: 'pagseguro' } );
    preencher( 'servicos_form__quem-somos', x.pagina.find( y => y.id == 'sobre' ) || { id: 'sobre' } );
    preencher( 'servicos_form', x.pagina.find( y => y.id == 'servico' ) || { id: 'servico' } );

    router( 'os', () => {
        let { reservas } = vio;
        let reserva = reservas.find( x => x.id == request.id );
        log( reserva );
        preencher( 'form-locacao', reserva );

        query( "#table_time_os" ).innerHTML = tpl_array( vio.time, "#tpl_time_os" );
        

    } );

} );


draw_select( tipo_error, 'tipo_error' );
draw_select( sim_nao, 'ativo' );
draw_select( sim_nao, 'juridico' );
draw_select( is_admin, 'admin' );
draw_select( estado, 'estado' );
draw_select( status_pagamento, 'status_pagamento' );
draw_select( status_compra, 'status_compra' );
draw_select( mes, 'mes' );
draw_select( site_sistema, 'site_sistema' );
draw_select( mensal_avulso, 'mensal_avulso' );


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
    vio.dominio = x;
    let lista = [...[{ id: '', nome: 'sistema'}], ...x];
    draw_select( lista, 'dominio' );
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
},100000 );

queryAll('.ico-plus').forEach( x => {
    x.addEventListener('click', function() {
        let id = this.href.split('#')[1];
        let id_form = query(`#${id} form`);
        query(`#${id} form`).reset();
        if( query(`#${id} form .editor-local`) ) {
            query(`#${id} form .editor-local`).innerHTML = '';
        }
        horario   = [];
        vio.mostrar_horarios = 1;
        let lista_var = queryAll(`#${id} form img:not([src*="ico"])`);
        for (let index = 0; index < lista_var.length; index++) {
            lista_var[index].src = 'disc/img/default.jpg';
        }        
    } );
} );

