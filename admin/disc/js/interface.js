"use strict";
var _vio = {};

var vio = {
    set modalidade(cont) {
        _vio.modalidade = cont;
        query('#modalidade__table_title').innerHTML = cont
            .map(x => `
                <tr>
                    <td><img src="./disc/ico/trash.png" class="ico-table"></td>
                    <td>${x.name}</td>
                    <td onclick="to( '?id=${x.id}#modalidade-nova' )">
                        <img src="./disc/ico/edit.png" class="ico-table">
                    </td>
                </tr>
        ` ).join('');
    },

    set admin(cont) {
        _vio.admin = cont;
        if(cont) {
            query('#selecionar-dominio').removeAttribute('disabled');            
            query('#selecionar-dominio').classList.remove('no-admin');            
        } else {
            query('#selecionar-dominio').setAttribute('disabled', 'disabled');
            query('#selecionar-dominio').classList.add('no-admin');            
        }
    },

    set sistema(cont) {
        _vio.sistema = cont;
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

    set modalidade_nova(cont) {
        _vio.modalidade_nova = cont;
        query('#modalidade__form_input_nome').innerHTML = cont.name;
        query('#modalidade__form_input_cor').innerHTML = cont.color;
    },

    set quadra(cont) {
        _vio.quadra = cont;
        query('#quadra__table_body').innerHTML = cont
            .map( x => `
                <tr>
                    <td><img src="./disc/ico/trash.png" class="ico-table"></td>
                    <td>${x.name}</td>
                    <td>${x.price_mounth}</td>
                    <td>${x.price_day}</td>
                    <td>
                        <img src="./disc/ico/field.png" class="ico-table">
                        <img onclick="to( '?id=${x.id}#quadra-nova' )" src="./disc/ico/edit.png" class="ico-table">
                    </td>
                </tr>
            ` ).join( '' );
    },

    set quadra_nova(cont) {
        _vio.quadra_nova = cont;
        query('#quadra-nova__form_select-modalidade').innerHTML = cont.modalidade.map(x => `<option value="${x.id}">${x.name}</option>`).join('');
        query('#quadra-nova__form_nome').innerHTML = cont.name;
        query('#quadra-nova__form_avulso').innerHTML = cont.price_day;
        query('#quadra-nova__form_mensal').innerHTML = cont.price_mounth;
        query('#quadra-nova__form_select-status').innerHTML = cont.status;
        query('#quadra-nova__form_text-areas').innerHTML = cont.html;
        query('#quadra-nova__form_1-grande').innerHTML = cont.img1_grande;
        query('#quadra-nova__form_1').innerHTML = cont.img1;
        query('#quadra-nova__form_3').innerHTML = cont.img2;
        query('#quadra-nova__form_4').innerHTML = cont.img3;
        query('#quadra-nova__form_5').innerHTML = cont.img4;
        query('#quadra-nova__form_6').innerHTML = cont.img5;
    },

    set horario(cont) {
        _vio.horario = cont;
        query('#horario__table_body').innerHTML = cont
            .map( x => `
                <tr>
                    <td><img src="./disc/ico/trash.png" class="ico-table"></td>
                    <td>${x.name}</td>
                    <td>${x.init}</td>
                    <td>${x.end}</td>
                    <td>
                        <img onclick="to( '?id=${x.id}#horario-novo' )" src="./disc/ico/edit.png" class="ico-table">
                    </td>
                </tr>
            ` ).join( '' );
    },

    set horario_novo(cont) {
        _vio.horario_novo = cont;
        query('#horario-novo__form_quadra').innerHTML = cont.quadra.map(x => `<option value="${x.id}">${x.name}</option>`).join('');
        query('#horario-novo__form_inicial').innerHTML = cont.init;
        query('#horario-novo__form_final').innerHTML = cont.end;
    },

    set capitao(cont) {
        _vio.capitao = cont;
        query('#capitao__table_body').innerHTML = cont
            .map( x => `
                <tr>
                    <td><img src="./disc/ico/trash.png" class="ico-table"></td>
                    <td>${x.name}</td>
                    <td>${x.telephone}</td>
                    <td>
                        <img onclick="to( '?id=${x.id}#capitao-novo' )" src="./disc/ico/edit.png" class="ico-table">
                    </td>
                </tr>
            ` ).join( '' );
    },

    set capitao_novo(cont) {
        _vio.capitao_novo = cont;
        query('#capitao-novo__form_nome').value = cont.name;
        query('#capitao-novo__form_apelido').innerHTML = cont.nickname;
        query('#capitao-novo__form_tel').innerHTML = cont.telephone;
        query('#capitao-novo__form_email').innerHTML = cont.mail;
        query('#capitao-novo__form_senha').innerHTML = cont.pass;
        query('#capitao-novo__form_select-status').innerHTML = cont.status;
        query('#capitao-novo__table__time_nome').innerHTML = cont.nome;
        query('#capitao-novo__table__time_apelido').innerHTML = cont.nickname;
        query('#capitao-novo__table__time_tel').innerHTML = cont.telephone;
        query('#capitao-novo__table__time_email').innerHTML = cont.mail;
    },

    set jogadores(cont) {
        _vio.capitao_novo = cont;
        query('#jogadores__table_body').innerHTML = cont
            .map( x => `
                <tr>
                    <td>${x.name}</td>
                    <td>${x.nickname}</td>
                    <td>${x.telephone}</td>
                    <td>${x.email}</td>
                </tr>
            ` ).join( '' );
    },

    set historico(cont) {
        _vio.capitao_novo = cont;
        query('#historico__table_body').innerHTML = cont
            .map( x => `
                <tr>
                    <td>${x.code}</td>
                    <td>${x.date}</td>
                    <td>${x.name}</td>
                    <td>${x.telephone}</td>
                    <td>${x.price_total}</td>
                    <td>${x.status}</td>
                    <td>
                    <a href="#detalhe-locacao">
                        <img onclick="to( '?id=${x.id}#detalhe-locacao' )" src="./disc/ico/eye.png" class="ico-table">
                    </a>
                    </td>
                </tr>
            ` ).join( '' );
    },

    set visual(cont) {
        _vio.visual = cont;
        query('#visual_form_title').innerHTML = cont.title;
        query('#visual_form_google').innerHTML = cont.description;
        query('#visual_form_descricao').innerHTML = cont.description;
        query('#visual_form_cor').innerHTML = cont.color;
        query('#visual_form_logo').innerHTML = cont.logo;
        query('#visual_form_facebook').innerHTML = cont.facebook;
        query('#visual_form_instagram').innerHTML = cont.instagram;
        query('#visual_form_twitter').innerHTML = cont.twitter;
        query('#visual_form_Youtube').innerHTML = cont.youtube;
        query('#visual__form_email').innerHTML = cont.email;
        query('#visual__form_tel').innerHTML = cont.telephone;
        query('#visual__form_whatsapp').innerHTML = cont.whatsapp;
        query('#visual__form_cep').innerHTML = cont.zipcode;
        query('#visual__form_rua').innerHTML = cont.street;
        query('#visual__form_numero').innerHTML = cont.number;
        query('#visual__form_bairro').innerHTML = cont.bairro;
        query('#visual__form_cidade').innerHTML = cont.city;
        query('#visual__form_estado').innerHTML = cont.state;
        query('#visual__form_map').innerHTML = cont.map;
        query('#visual_form_email-pagseguro').innerHTML = cont.email;
        query('#visual_form_token').innerHTML = cont.token;
    },

    set quem_somos(cont) {
        _vio.quem_somos = cont;
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
        _vio.servicos = cont;
        query('#servicos__form_title').innerHTML = cont.title;
        query('#servicos__form_text-area').innerHTML = cont.html;
    },

    set banner(cont) {
        _vio.banner = cont;
        query('#banner__table_body').innerHTML = cont
            .map( x => `
                <tr>
                    <td><img src="./disc/ico/trash.png" class="ico-table"></td>
                    <td>${x.name}</td>
                    <td>
                        <img onclick="to( '?id=${x.id}#banner-novo' )" src="./disc/ico/edit.png" class="ico-table">
                    </td>
                </tr>
            ` ).join( '' );
    },

    set banner_novo(cont) {
        _vio.banner_novo = cont;
        query('#banner-novo__form_nome').innerHTML = cont.name;
        query('#banner-novo__form_link').innerHTML = cont.link;
        query('#banner-novo__form_text').innerHTML = cont.text;
        query('#banner-novo__form_photo').innerHTML = cont.photo;
        query('#banner-novo__form_status').innerHTML = cont.status;
    },

    set dominio(cont) {
        _vio.dominio = cont;
        query('#dominio__table_body').innerHTML = cont.map( x => `
                <tr>
                    <td><img onclick="delete_dominio( '${x.id}' )" src="./disc/ico/trash.png" class="ico-table"></td>
                    <td>${x.name || ''}</td>
                    <td>${( x.ativo || '' === '1' ) ? 'sim' : 'não'}</td>
                    <td>
                        <img onclick="to( '#dominio-novo' ); edite_dominio('${x.id}')" src="./disc/ico/edit.png" class="ico-table">
                    </td>
                </tr>
            ` ).join( '' );
    },

    set dominio_novo(cont) {
        _vio.dominio_novo = cont;
        query('#dominio-novo__form_id').value = cont.id || '';
        query('#dominio-novo__form_nome').value = cont.name || '';
        query('#dominio-novo__form_dominio').value = cont.domain || '';
        query(`#dominio-novo__form_status option[value='${cont.ativo || '1'}']`).setAttribute('selected','');
    },

    set usuario(cont) {
        _vio.usuario = cont;
        query('#usuario__table_body').innerHTML = cont
            .map( x => `
                <tr>
                    <td><img onclick="delete_usuario('${x.mail}')" src="./disc/ico/trash.png" class="ico-table"></td>
                    <td>${x.name}</td>
                    <td>${x.telephone}</td>
                    <td>${( x.ativo == 1 ) ? 'sim' : 'não'}</td>
                    <td>
                        <img onclick="to( '#usuario-novo' ); edit_usuario('${x.id}')" src="./disc/ico/edit.png" class="ico-table">
                    </td>
                </tr>
            ` ).join( '' );
    },

    set usuario_novo(cont) {
        _vio.usuario_novo = cont;
        query('#usuario-novo__form_id').value = cont.id || '';
        query('#usuario-novo__form_nome').value = cont.name || '';
        query('#usuario-novo__form_email').value = cont.mail || '';
        query('#usuario-novo__form_tel').value = cont.telephone || '';
        if ( typeof cont.domain === 'string' ) {
            query(`#usuario-novo__form_dominio option[value="${cont.domain || ''}"]`).setAttribute('selected', 'true');
        } else {
            query('#usuario-novo__form_dominio').innerHTML = cont.domain.map(x => `<option value="${x.id}">${x.name}</option>`).join('');
        }
        query(`#usuario-novo__form_nivel option[value="${cont.admin || '1'}"]`).setAttribute('selected', 'true');
        query(`#usuario-novo__form_status option[value="${cont.ativo || '1'}"]`).setAttribute('selected', 'true');
    },

    set registro_problema(cont) {
        _vio.registro_problema = cont;
        query('#registro-problema__table_body').innerHTML = cont
            .map( x => `
                <tr>
                    <td><img src="./disc/ico/trash.png" class="ico-table"></td>
                    <td>${x.domain}</td>
                    <td>${x.name}</td>
                    <td>${x.telephone}</td>
                    <td>${x.description}</td>
                    <td>${x.type}</td>
                </tr>
            ` ).join( '' );
    },

    set perfil(cont) {
        _vio.perfil = cont;
        query('#perfil__form_nome').value = cont.name;
        query('#perfil__form_email').value = cont.mail;
        query('#perfil__form_tel').value = cont.telephone;
    },

    set relar_problema(cont) {
        _vio.relar_problema = cont;
        query('#relar-problema__select').innerHTML = cont.type_error;
        query('#relar-problema__descriocao').innerHTML = cont.description;
    },

    set estaticos_pagina(cont) {
        _vio.estaticos_pagina = cont;
        query('#selecionar-dominio').innerHTML = cont.map(x => `<option value="${x.id}">${x.name}</option>`).join('');
    },

    set aside_quadra(cont) {
        _vio.aside_quadra = cont;
        query('#aside').innerHTML = cont
            .map( x => `
                <div id="aside_quadra" class="box gap gap-bottom text-center">
                <svg class="quadrasvg" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;margin: 20px;" xml:space="preserve">
                    <g>
                        <g>
                            <path fill="#05f" d="M482,91.03H30c-16.542,0-30,13.458-30,30v269.94c0,16.542,13.458,30,30,30h452c16.542,0,30-13.458,30-30V121.03
                                C512,104.488,498.542,91.03,482,91.03z M482.013,308.958h-45.191V203.042h45.184L482.013,308.958z M271,218.896
                                c14.772,5.926,25.229,20.319,25.229,37.104c0,16.785-10.457,31.179-25.229,37.104V218.896z M30,203.042h45.178v105.916H30V203.042
                                z M241,293.104c-14.772-5.926-25.229-20.319-25.229-37.104c0-16.785,10.457-31.179,25.229-37.104V293.104z M241,187.624
                                c-31.539,6.869-55.229,34.91-55.229,68.376s23.69,61.507,55.229,68.376v66.594H30v-52.012h60.178c8.284,0,15-6.716,15-15V188.042
                                c0-8.284-6.716-15-15-15H30V121.03h211V187.624z M482,390.97H271v-66.594c31.539-6.869,55.229-34.91,55.229-68.376
                                s-23.69-61.507-55.229-68.376V121.03h211l0.004,52.012h-60.181c-8.284,0-15,6.716-15,15v135.916c0,8.284,6.716,15,15,15h60.193
                                l0.003,52.011C482.019,390.969,482.013,390.97,482,390.97z"/>
                        </g>
                    </g>
                </svg>
                <h6>${x.name}</h6>
                <smal class="gray-text">${x.modalidade}</small>
            ` );
    },

    set agenda(cont) {
        _vio.agenda = cont;
        log( cont );
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
}

Object.keys( vio ).forEach( index => {
    Object.defineProperty(vio, index, {
        get: function() { return _vio[index]; },    
    });
} );