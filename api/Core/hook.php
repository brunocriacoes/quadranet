<?php

    $_REQUEST = array_filter( $_REQUEST, function( $EL ) {
        return !empty( $EL ) ;
    } ); 

    $_REQUEST = array_map( function( $el ) {
        if( is_string( $el ) ) :
            $el = trim( $el );
            $el = urldecode( $el );
            $el = addslashes( $el );
        endif;
        return $el;
    }, $_REQUEST );

    if( empty( $_REQUEST['_filds'] ) ) $_REQUEST['_filds']   = "";
    if( empty( $_REQUEST['_method'] ) ) $_REQUEST['_method'] = "GET";
    if( empty( $_REQUEST['_start'] ) ) $_REQUEST['_start']   = 0;
    if( empty( $_REQUEST['_count'] ) ) $_REQUEST['_count']   = 12;
    $_REQUEST['_count'] = $_REQUEST['_count'] > 200 ? 200 : $_REQUEST['_count'];
    $_REQUEST['_start'] = (int) $_REQUEST['_start'];
    $_REQUEST['_count'] = (int) $_REQUEST['_count'];
    
    $_REQUEST['_dominio'] = $_REQUEST['_dominio'] ?? "";

    $_REQUEST['update']      = date( 'Y-m-d' );
    $_REQUEST['updateInt']   = strtotime( date( 'Y-m-d' ) );

    if ( empty( $_REQUEST['criado'] ) ) $_REQUEST['criado']             = date( 'Y-m-d' );
    if ( empty( $_REQUEST['criadoInt'] ) ) $_REQUEST['criado-int']     = strtotime( date( 'Y-m-d' ) );
    if ( empty( $_REQUEST['criadoPrint'] ) ) $_REQUEST['criado-print'] = date( 'd/m/Y' );

    if ( empty( $_REQUEST['ID'] ) AND  $_REQUEST['_method'] != 'GET' ) $_REQUEST['ID']               = uniqid();
    if ( !empty( $_REQUEST['pass'] ) ) $_REQUEST['pass']          = sha1( $_REQUEST['pass'] );
    if ( !empty( $_REQUEST['password'] ) ) $_REQUEST['password']  = sha1( $_REQUEST['password'] );
    if ( !empty( $_REQUEST['email'] ) ) $_REQUEST['emailCrip']   = sha1( $_REQUEST['email'] );
    if ( !empty( $_REQUEST['email'] ) ) $_REQUEST['emailMd5']    = md5( $_REQUEST['email'] );
    if ( !empty( $_REQUEST['emailMd5'] ) ) $_REQUEST['gravatar'] = "https://www.gravatar.com/avatar/{$_REQUEST['emailMd5']}";
    if ( empty( $_REQUEST['status'] ) ) $_REQUEST['status']       = 1;
    if ( !empty( $_REQUEST['status'] ) ) $_REQUEST['status']      = (int) $_REQUEST['status'];
    if ( !empty( $_REQUEST['cep'] ) ) $_REQUEST['cep']            = str_replace( ['-',' '], ['',''], $_REQUEST['cep'] );
    if( !empty( $_REQUEST['pass'] ) OR !empty( $_REQUEST['password'] ) ):
        $_REQUEST['ID'] = sha1( $_REQUEST['email'] ?? uniqid() );
    endif;
    $_REQUEST['origin'] = $_SERVER['HTTP_REFERER'] ?? "não definido";    
    
    if( !empty( $_REQUEST['uri'] ) ):
        $title               = urldecode( $_REQUEST['title'] ?? "" );
        $url                 = urldecode( $_REQUEST['uri'] );
        $_REQUEST['qr']      = "http://chart.apis.google.com/chart?cht=qr&chl={$url}&chs=170x170";
        $_REQUEST['shareTw'] = "http://twitter.com/intent/tweet?text={$title}&url={$url}&via=mininov";
        $_REQUEST['shareFc'] = "http://facebook.com/share.php?u={$url}";
        $_REQUEST['shareGo'] = "https://plus.google.com/share?url={$url}";
    endif;

    $_REQUEST['urls']     = explode( '?', $_SERVER['REQUEST_URI'] );
    $_REQUEST['urls']     = explode( '/', $_REQUEST['urls'][0] );
    $_REQUEST['urls']     = array_filter( $_REQUEST['urls'], function( $el ) { return !empty( $el ); } );
    $_REQUEST['urls']     = array_values( $_REQUEST['urls'] ); 
    $_REQUEST['urls']     = array_slice( $_REQUEST['urls'], OFFSET );

    if( !empty( $_REQUEST['cep'] ) && strlen( $_REQUEST['cep'] ) == 8 ):
        $url_cep                 = "https://viacep.com.br/ws/{$_REQUEST['cep']}/json/";
        @$get_contet             = file_get_contents( $url_cep );
        if( $get_contet ):
            $json                    = json_decode( $get_contet );
            $_REQUEST['ruaAvenida'] = $json->logradouro ?? "";
            $_REQUEST['bairro']      = $json->bairro ?? "";
            $_REQUEST['localidade']  = $json->localidade ?? "";
            $_REQUEST['uf']          = $json->uf ?? "";
        endif;
    endif;

    define( 'dominio', $_SERVER['SERVER_NAME'] ) ;
    define( 'http'   , $_SERVER['REQUEST_SCHEME'] ) ;
    define( 'method' , $_SERVER['REQUEST_METHOD'] ) ;
    define( 'port'   , $_SERVER['SERVER_PORT'] ) ;
    define( 'uri'    , http . "://" . dominio ) ;
    // define( 'url'    , $_SERVER['REQUEST_URI'] ) ;
    define( 'url'    , $_SERVER['REDIRECT_URL'] ) ;
    define( 'urls'   , array_values( array_filter( explode( '/', url ) , function( $iten ) { return ! empty( $iten );  } ) ) );
    define( 'origin' , $_SERVER['HTTP_REFERER'] ?? false ) ;
    define( 'request', $_REQUEST ?? [] );