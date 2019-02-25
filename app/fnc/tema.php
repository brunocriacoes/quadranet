<?php

    require __DIR__ . "/../core/hook.php";

    $pasta = __DIR__ . "/../../painel/theme/";
    $lista_pasta = scandir( $pasta );
    $lista_pasta = array_filter( $lista_pasta, function( $x ) {
        return strlen( $x ) > 2;
    } );
    $lista_pasta = array_values( $lista_pasta );
    $lista_pasta = array_map( function( $nome ) use ( $pasta ) {
        $nome_json   = "{$pasta}{$nome}/info.json";
        @$json        = json_decode( file_get_contents( $nome_json ) );
        $json->pasta = $nome;
        $json->imagem = uri.'/painel/theme/'.$nome.'/apresentacao.png';
        $json->link = uri.'?tema='.$nome;
        return $json;
    }, $lista_pasta );
    
    echo json_encode( $lista_pasta );

    return $lista_pasta;