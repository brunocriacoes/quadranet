"use strict";
var _vio = {};

var vio = {
    set modalidade( arr ) {
        _vio.modalidade = arr || [];
        query('#modalidade__table_title').innerHTML = arr
            .map(x => `
                <tr>
                    <td>${x.nome || ''}</td>
                    <td onclick=" editar( 'modalidade', '${x.id}', 'modalidade-nova', 'dash.html#modalidade-nova' )">
                    <img src="./disc/ico/edit.png" class="ico-table">
                    </td>
                    <td><img src="./disc/ico/trash.png" class="ico-table" onclick="trash( 'modalidade', '${x.id}' )"></td>
                </tr>
        ` ).join('');
        draw_select( arr, 'modalidade' );
        
    },

    set admin(cont) {
        _vio.admin = cont || [];
        if(cont) {
            query('#selecionar-dominio').removeAttribute('disabled');            
            query('#selecionar-dominio').classList.remove('no-admin');            
        } else {
            query('#selecionar-dominio').setAttribute('disabled', 'disabled');
            query('#selecionar-dominio').classList.add('no-admin');            
        }
    },

    set sistema(cont) {
        _vio.sistema = cont || [];
        if(cont) {
            query( '#aside-sistema' ).style.display       = 'none';
            query( '[for="menu_quadra"]' ).style.display  = 'none';
            query( '[for="menu_theme"]' ).style.display   = 'none';
            query( '[for="menu_theme"]' ).style.display   = 'none';
            query( '[href="#relar-problema"]' ).style.display = 'none';
            query( '[for="menu_sistema"]' ).style.display = 'inline-block';
            query('#menu_sistema').setAttribute('checked', "true");
            to('#dominio');
        } else {
            query( '#aside-sistema' ).style.display       = 'block';
            query( '[href="#relar-problema"]' ).style.display = 'inline-block';
            query( '[for="menu_quadra"]' ).style.display  = 'inline-block';
            query( '[for="menu_theme"]' ).style.display   = 'inline-block';
            query( '[for="menu_sistema"]' ).style.display = 'none';
            query('#menu_quadra').setAttribute('checked', "true");
            to('#agenda');
        }
    },

    set quadra( arr ) {
        _vio.quadra = arr || [];
        query('#quadra__table_body').innerHTML = arr
            .map( x => `
                <tr>                    
                    <td>${x.nome || ''}</td>
                    <td>R$ ${x.mensalidade || ''}</td>
                    <td>R$ ${x.diaria || ''}</td>
                    <td>                        
                        <img onclick="editar( 'quadra', '${x.id}', 'quadra_nova__form', 'dash.html#quadra-nova' )" src="./disc/ico/edit.png" class="ico-table">
                    </td>
                    <td><img src="./disc/ico/field.png" onclick="edita_quadra('${x.id}')" class="ico-table"></td>
                    <td><img src="./disc/ico/trash.png" onclick="trash( 'quadra', '${x.id}'  )" class="ico-table"></td>
                </tr>
            ` ).join( '' );
        vio.aside_quadra = 1;
    },

    set horario(arr) {
        _vio.horario = arr || [];
    },
    set auth2( arr ) {
        _vio.auth2 = arr || [];
    },


    set _user( arr ) {
        vio.auth2  = arr
        _vio._user = arr || [];
        query('#capitao__table_body').innerHTML = arr.map( x => `
            <tr>                
                <td>${x.nome || ''}</td>
                <td>${x.whatsapp || x.celular || ''}</td>
                <td>${x.cpf_cnpj || ''}</td>
                <td>${x.acrescimoValor?'Sim':'Não'}</td>
                <td>
                    <img onclick="editar( '_user', '${x.id}', 'form-contratante', 'dash.html?editarContrante=${x.id}#contratante' )" src="./disc/ico/edit.png" class="ico-table">
                </td>
                <td><img onclick="trash( '_user', '${x.id}' )" src="./disc/ico/trash.png" class="ico-table"></td>
            </tr>
        ` ).join( '' );
    },

    set jogadores(cont) {
        _vio.capitao_novo = cont || [];
        query('#jogadores__table_body').innerHTML = cont
            .map( x => `
                <tr>
                    <td>${x.nome || ''}</td>
                    <td>${x.idade || ''}</td>
                    <td>${x.posicao || ''}</td>
                    <td>${x.celular || x.whatsapp}</td>
                    <td>${x.email || ''}</td>
                    <td><img onclick="trash( 'espera', '${x.id}' )" src="./disc/ico/trash.png" class="ico-table"></td>
                </tr>
            ` ).join( '' );
    },

    set visual(cont) {
        _vio.visual = cont || [];
        query('#visual_form_title').innerHTML = cont.title;
        query('#visual_form_google').innerHTML = cont.description;
        query('#visual_form_descricao').innerHTML = cont.description;
        query('#visual_form_cor').innerHTML = cont.color;
        query('#visual_form_logo').src = cont.logo;
        query('#visual_form_facebook').value = cont.facebook;
        query('#visual_form_instagram').value = cont.instagram;
        query('#visual_form_twitter').value = cont.twitter;
        query('#visual_form_Youtube').value = cont.youtube;
        query('#visual__form_email').value = cont.email;
        query('#visual__form_tel').value = cont.telephone;
        query('#visual__form_whatsapp').value = cont.whatsapp;
        query('#visual__form_cep').value = cont.zipcode;
        query('#visual__form_rua').value = cont.street;
        query('#visual__form_numero').value = cont.number;
        query('#visual__form_bairro').value = cont.bairro;
        query('#visual__form_cidade').value = cont.city;
        query('#visual__form_estado').innerHTML = cont.state;
        query('#visual__form_map').innerHTML = cont.map;
        query('#visual_form_email-pagseguro').innerHTML = cont.email;
        query('#visual_form_token').innerHTML = cont.token;
    },

    set quem_somos(cont) {
        _vio.quem_somos = cont || [];
        query('#quem-somos__form_title').innerHTML = cont.title;
        query('#quem-somos__form_text-area').innerHTML = cont.html;
        query('#quem-somos__form_1-grande').innerHTML = cont.img1_grande;
        query('#quem-somos__form_1').innerHTML = cont.img1;
        query('#quem-somos__form_3').innerHTML = cont.img2;
        query('#quem-somos__form_4').innerHTML = cont.img3;
        query('#quem-somos__form_5').innerHTML = cont.img4;
        query('#quem-somos__form_6').innerHTML = cont.img5;
    },

    set servicos(cont) {
        _vio.servicos = cont || [];
        query('#servicos__form_title').innerHTML = cont.title;
        query('#servicos__form_text-area').innerHTML = cont.html;
    },

    set banner(arr) {
        _vio.banner = arr || [];
        query('#banner__table_body').innerHTML = tpl_array( arr, '#tr_banner', 'banner' );
    },

    set anuncio(arr) {
        _vio.anuncio = arr || [];
        query('#anuncio__table_body').innerHTML = tpl_array( arr, '#tr_anuncio', 'anuncio' );
    },

    set blog(arr) {
        _vio.blog = arr || [];
        query('#blog__table_body').innerHTML = tpl_array( arr, '#tr_blog', 'blog' );
    },

    set dominio(arr) {
        _vio.dominio = arr || [];
        draw_select( arr, 'dominio' );
        query('#dominio__table_body').innerHTML = tpl_array( arr, '#tr_default', 'dominio' );
    },

    set auth(arr) {
        _vio.auth = arr;
        this.usuario = arr;
    },
    set usuario(arr) {
        _vio.usuario = arr || [];
        query('#usuario__table_body').innerHTML = tpl_array( arr, '#tr_usuario', 'usuario' );
    },

    set error(arr) {
        _vio.error = arr || [];
        query('#registro-problema__table_body').innerHTML = tpl_array( arr, '#tr_error', 'error' );
    },

    set estaticos_pagina(cont) {
        _vio.estaticos_pagina = cont || [];
        query('#selecionar-dominio').innerHTML = cont.map(x => `<option value="${x.id}">${x.name}</option>`).join('');
    },

    set aside_quadra( gatilho ) {
        let quadra     = _vio.quadra || [];
        let modalidades = _vio.modalidade || [];
        query('#aside').innerHTML = quadra.map( x => {
            let modalidade = modalidades.find( z => z.id == x.modalidade  ) || {};
            return `
                <div id="aside_quadra" class="ativa_quadra_${x.id} box gap-aside text-center" onclick="edita_quadra( '${x.id}' );to('${admin}/dash.html#agenda')">
                    <svg
                        xmlns:dc="http://purl.org/dc/elements/1.1/"
                        xmlns:cc="http://creativecommons.org/ns#"
                        xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                        xmlns:svg="http://www.w3.org/2000/svg"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                        xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
                        viewBox="0 -52 512 407.99999"
                        width="60%"
                        version="1.1"
                        sodipodi:docname="sports-and-competition.svg"
                        inkscape:version="0.92.3 (2405546, 2018-03-11)">
                    
                    <defs
                        id="defs8" />
                    <sodipodi:namedview
                        pagecolor="#ffffff"
                        bordercolor="#666666"
                        borderopacity="1"
                        objecttolerance="10"
                        gridtolerance="10"
                        guidetolerance="10"
                        inkscape:pageopacity="0"
                        inkscape:pageshadow="2"
                        inkscape:window-width="1366"
                        inkscape:window-height="705"
                        id="namedview6"
                        showgrid="false"
                        units="px"
                        inkscape:zoom="0.34322678"
                        inkscape:cx="637.41198"
                        inkscape:cy="523.14847"
                        inkscape:window-x="-8"
                        inkscape:window-y="-8"
                        inkscape:window-maximized="1"
                        inkscape:current-layer="svg4" />
                    <path fill="${modalidade.cor}"
                        d="m 492,149 c 11.04687,0 20,-8.95313 20,-20 V 27.999992 c 0,-44.113279 -35.88672,-79.999999 -80,-79.999999 H 80.000001 C 35.88672,-52.000007 7.7744225e-7,-16.113287 7.7744225e-7,27.999992 V 276 C 7.7744225e-7,320.11328 35.88672,356 80.000001,356 H 432 c 44.11328,0 80,-35.88672 80,-80 v -48 c 0,-11.04688 -8.95313,-20 -20,-20 h -40 c -11.02734,0 -20,-8.97266 -20,-20 v -72 c 0,-11.02734 8.97266,-20.000004 20,-20.000004 h 20 V 129 c 0,11.04687 8.95312,20 20,20 z M 236,206.44531 C 213.84375,198.27734 198,176.95703 198,152 c 0,-24.95703 15.84375,-46.27734 38,-54.445314 z M 276,97.554686 c 22.15625,8.167974 38,29.488284 38,54.445314 0,24.95703 -15.84375,46.27734 -38,54.44531 z M 40.000001,95.999996 h 20 c 11.027344,0 20,8.972664 20,20.000004 v 72 c 0,11.02734 -8.972656,20 -20,20 h -20 z m 0,180.000004 v -28 h 20 C 93.085939,248 120,221.08594 120,188 V 116 C 120,82.914052 93.085939,55.999992 60.000001,55.999992 h -20 v -28 c 0,-22.054688 17.945312,-39.999999 40,-39.999999 H 236 V 56.054682 C 191.51953,65.316402 158,104.81641 158,152 c 0,47.18359 33.51953,86.6875 78,95.94531 V 316 H 80.000001 c -22.054688,0 -40,-17.94531 -40,-40 z M 452,55.999992 c -33.08594,0 -60,26.91406 -60,60.000008 v 72 c 0,33.08594 26.91406,60 60,60 h 20 v 28 c 0,22.05469 -17.94531,40 -40,40 H 276 V 247.94531 C 320.48047,238.68359 354,199.18359 354,152 354,104.81641 320.48047,65.312492 276,56.054682 v -68.054689 h 156 c 22.05469,0 40,17.945311 40,39.999999 v 28 z m 0,0"
                        id="path2"
                        inkscape:connector-curvature="0" />
                    </svg>
                    <h6>${x.nome || ''}</h6>
                    <small class="gray-text">${modalidade.nome|| ''}</small>
                </div>
            `;
        } );
    },

    set agenda(cont) {
        _vio.agenda = cont;
        query('#agenda__title').innerHTML = cont.name;
        query('#agenda__modalidade').innerHTML = cont.modalidade;
        query('#agenda__data').innerHTML = cont.date;
        query('#agenda__dia-semana').innerHTML = cont.day;
    },

    set mudar_senha(cont) {
        _vio.mudar_senha = cont;
        query('#mudar-senha_password').innerHTML = cont.pass;
        query('#mudar-senha_new-password').innerHTML = cont.password;
    },
    set mostrar_horarios( catilho ) {
        query('#horarios').innerHTML = tpl_array( horario, '#tpl-horas' );
    },
    set reservas( arr ) {        
        _csv                  = arr;
        BalancoFiltro.itens   = arr
        BalancoFiltro.init()
        busca_os_contratante()

        edita_quadra( quadra_sisten );
        arr.forEach( x => {
            if ( !x.status_compra ) {
                x.status_compra = 1;
            }
            let tipo_pagamento = status_pagamento.find( y => y.id == x.status_compra  ) || {};
            x.pagamento        = tipo_pagamento.nome || 'aguardando pagamento';
            let id_quadra      = x.id.substr( 25, 34 );
            let todas_quadra   = vio.quadra;
            let qd             = todas_quadra.find( z => z.id == id_quadra ) || {};
            if( x.tipo_contatacao == 1 ) {
                x.valor            = qd.diaria || '0,00';
            } else {
                x.valor            = qd.mensalidade || '0,00';
            }
        } );
        arr = arr.map( item => ( {
            ...item,
            tipocontratacao_print: item.tipo_contatacao == "1" ? "Avulso" : "Mensal",
            dia_print: semana_print[ item.id.substr(23,1) ],
            site_print: item.site == 1 ? "Site" : "Sistema",
            data_print:  item.id.substr(0,10).split('-').reverse().join('/')
        } ) )
        _vio.reservas = arr;
        
    },
    set espera( arr ) {
        _vio.espera = arr;
        vio.jogadores = arr;
    },
    set parcial( arr ) {
        _vio.parcial = arr;
    },
    set site( arr ) {
        _vio.site = arr;
    },
    set time( arr ) {
        _vio.time = arr;
    },

}

Object.keys( vio ).forEach( index => {
    Object.defineProperty(vio, index, {
        get: function() { return _vio[index]; },    
    });
} );