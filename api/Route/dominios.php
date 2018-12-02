<?php

    $domino_folder = __DIR__ . "/../Data/dominio/index.json";
    $json          = [];
    if( file_exists( $domino_folder ) ):
       $json = (array) json_decode( file_get_contents( $domino_folder ) );
    endif;
    $ativos  = array_filter( $json, function( $ELL ) { return $ELL; } );

    $dominios = array_map( function( $ID ) {
        $file         = __DIR__ . "/../Data/dominio/{$ID}.json";
        $json_dominio = [];
        if( file_exists( $file ) ):
            $json_dominio = (array) json_decode( file_get_contents( $file ) ); 
        endif;
        return $json_dominio["dominio"] ?? 'default.com.br';
    }, array_keys( $ativos ) );

    $array    = array_map( function( $EL ) {
        return [
            "text"  => $EL,
            "value" => $EL
        ];
    }, $dominios );
    $array[]   = [
        "text"  => 'sistema',
        "value" => ''
    ];
    echo json_encode( $array );