"use strict";

window.onpopstate = function() {
    // search = params();
    // page   = window.location.hash.replace('#', '');
    evidenciaSession()

    fetch( `${app}` )
    .then( j => j.json() )
    .then( x => {
        let lista =  Object.keys( x );
        lista.forEach( e => {
            vio[e] = x[e];
        } );
    } )
}

evidenciaSession()

var _reservas = [];
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

    BalancoFiltro.itens                       = x.reservas || []
    BalancoFiltro.ano                         = Number( new Date().getFullYear() )
    BalancoFiltro.init()
    query('#historico__table_body').innerHTML = tpl_array( BalancoFiltro.print, '#tpl_historico' );
    _csv                                      = BalancoFiltro.csv;
    
    preencher( 'visual__form__info', x.site.find( y => y.id == 'info' ) || { id: 'info' } );
    preencher( 'visual__form__social', x.site.find( y => y.id == 'info' ) || { id: 'info' } );
    preencher( 'visual__form__contato', x.site.find( y => y.id == 'info' ) || { id: 'info' } );
    preencher( 'visual__form__termo', x.site.find( y => y.id == 'info' ) || { id: 'info' } );
    preencher( 'visual__form__chat', x.site.find( y => y.id == 'info' ) || { id: 'info' } );
    preencher( 'visual__form__pag', x.site.find( y => y.id == 'pagseguro' ) || { id: 'pagseguro' } );
    preencher( 'servicos_form__quem-somos', x.pagina.find( y => y.id == 'sobre' ) || { id: 'sobre' } );
    preencher( 'servicos_form', x.pagina.find( y => y.id == 'servico' ) || { id: 'servico' } );

    calc_balanco( '0', '0' )
    router( 'os', () => {

        draw_select( status_compra2, 'status_compra' );
        let { reservas }    = vio;
        let parciais        = vio.parcial || [];
        let id              = request.id || '';
        let ia              = id.split('-') || '';
        let reserva         = reservas.find( x => x.id == id ) || {};
        _reservas = reserva;
        
        _pagos       = reserva.pagos || ''
        let pagantes = reserva.pagos || ''
        pagantes     = pagantes.split(',') || [] 
        pagantes     = pagantes.filter( x => x.length > 7 ) || []

        _parcial_data.total = reserva.valor || '';

        reservas         = reservas.map( x => {
            x.data = x.id.substr(0, 10).split('-').reverse().join('/');
            let contratacao   = x.tipocontratacao || 1;
            x.tipocontratacao = contratacao == 1 ? "Avulso" : "Mensal";
            return x;
        } );

        _parcial = parciais.filter( x => x.quadra == request.id );

        reservas = reservas.filter( x => {
            let rx = new RegExp( `.{5}${ia[1]}.{4}${ia[3]}-${ia[4]}-${ia[5]}-${ia[6]}-${ia[7]}-${ia[8]}`, "gi" );
            return x.id.search( rx ) != -1 ? true : false; 
        } );
        
        preencher( 'form-locacao', reserva );
        preencher( 'form-locacao-mocado', reserva );
        let meu_time = vio.time
        meu_time = meu_time.filter( player => player.id_contratante == reserva.contratante_email )
        meu_time = meu_time.map( x => {
            let check = ""
            if( pagantes.indexOf( x.id ) != -1 ) {
                check = "checked"
            }
            return {
                ...x,
                check,
                reserva: reserva.id
            }
        } )
        query( "#table_iten_os" ).innerHTML = tpl_array( reservas, "#tpl_iten_os" );
        query( "#table_time_os" ).innerHTML = tpl_array( meu_time, "#tpl_time_os" );
        _meu_time = meu_time;

        parcial();
        
    } );

    let selected_dominio = query(`#selecionar-dominio [value='${dominio}']`);
    if( selected_dominio ) {
        selected_dominio.selected = true;
    }

    let seletor = query(`#selecionar-dominio option[value='${dominio}']`);
    if(  seletor  ){
        seletor.setAttribute( 'selected', '' );
    }

} );


draw_select( tipo_error, 'tipo_error' );
draw_select( sim_nao, 'ativo' );
draw_select( sim_nao, 'juridico' );
draw_select( is_admin, 'admin' );
draw_select( estado, 'estado' );
draw_select( status_pagamento, 'status_pagamento' );
draw_select( status_compra, 'status_compra' );
draw_select( mes, 'mes' );
draw_select( anos, 'anos' );
draw_select( site_sistema, 'site_sistema' );
draw_select( mensal_avulso, 'mensal_avulso' );

var _profile = {}
fetch( `${app}/auth/?profile=${window.localStorage.token_painel || '' }` )
.then( x => x.json() )
.then( x => {
    x.update = 1;
    _profile = x
    preencher( 'form-perfil', x );
    preencher( 'form-mudar', x );
    if( x.admin == "2" ) {
        let selectDominio = query('#selecionar-dominio')
        let someneteAdmin = query("#somente-admin")
        if( selectDominio ) { selectDominio.removeAttribute('disabled') }
        if(someneteAdmin) { someneteAdmin.removeAttribute('hidden') }
    }
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
    vio.auth = x;
} );


day = hoje().data_sisten;

query("#reserva_data").innerHTML = day.split('-').reverse().join('/');
query("#ocupado_data").innerHTML = day.split('-').reverse().join('/');

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
        let id               = this.href.split('#')[1];
        horario              = []
        vio.mostrar_horarios = 1;
        reset_form( `#${id}` );      
    } );
    let nome = x.href.split('#')[1].replace(/\-/gi,' ').toUpperCase();
    x.setAttribute('title', `ADICIONAR ${nome}`)
} );
let nomeSessionSite = localStorage.sessionSite || 'menu_quadra'
let sessaoAtiva     = query( `[for="${nomeSessionSite}"]` )
if( sessaoAtiva ) {
    sessaoAtiva.click()
}
let dataAtual = query('#dia_atual')
if( dataAtual ) {
    let data_tmp    = hoje()
    dataAtual.value = data_tmp.data_sisten
}
removerReserva()

document.querySelectorAll( `[name*=whats]` )
.forEach( campo => {
    campo
    .addEventListener( 'input', function() {
        masc( this, '(99) 9 9999-9999' )
    } )
} )

document.querySelectorAll( `[name*=tel], [name*=phon]` )
.forEach( campo => {
    campo
    .addEventListener( 'input', function() {
        masc( this, '(99) 9999-9999' )
    } )
} )

document.querySelectorAll( `[name*=cep]` )
.forEach( campo => {
    campo
    .addEventListener( 'input', function() {
        masc( this, '99999-999' )
    } )
} )

document.querySelectorAll( `[name*=cpf], [name*=cnpj]` )
.forEach( campo => {
    campo
    .addEventListener( 'input', function() {
        if( this.value.length < 15 ) {
            masc( this, '999.999.999-99', false )
        } else {
            masc( this, '99.999.999/9999-99' )
        }        
    } )
} )

setInterval( () => {
    fetch( `${app}` )
    .then( j => j.json() )
    .then( x => {

        let reservas = x.reservas || []
        reservas         = reservas.map( x => {
            x.site_print            = x.site == "1"? "Site" : "sistema"
            x.tipocontratacao_print = x.tipocontratacao == "1" ? "Avulso" : "Mensal"
            return x;
        } );
        x.reservas = reservas

        BalancoFiltro.itens             = x.reservas
        BalancoFiltro.init()

        let lista =  Object.keys( x );
        lista.forEach( e => {
            vio[e] = x[e];
        } );
        if( quadraAtivaId != '' ) {
            atualizaAgenda( quadraAtivaId )
        }
        busca_os_contratante()
        localizar_contratante()
    } )
}, 60 * 1000 )