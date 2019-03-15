<?php

    header('Access-Control-Allow-Origin: *');
    header('Content-Type: text/html; charset=utf-8');
    date_default_timezone_set('America/Sao_Paulo');

    define( 'tema', 'start' );

    include __DIR__ . '/app/core/hook.php';
    include __DIR__ . '/app/core/help.php';
    include __DIR__ . '/funcoes.php';
    
    $data    = json_decode( file_get_contents( uri.'/app' ) );
    $html    = '';
    $header  = get_part( 'header' );
    $footer  = get_part( 'footer' );

    if( empty( urls[0] ) ) {
        $html  = get_part( 'index' );
        $html  = $header . $html . $footer;

    } else {
        $html  = get_part( urls[0] );
        $html  = $header . $html . $footer;       
    }

    $pasta = uri . "/tema/".tema."/";
    $html  = preg_replace( '/link .*href="(?!h)/', "link rel=\"stylesheet\" href=\"{$pasta}", $html );
    $html  = preg_replace( '/src="(?!h)/', "src=\"{$pasta}", $html );

    $componente = [
        [ "is_array" => true,  "flag" => "banner",  "data" => $data->banner ?? [],  "tpl" => "banner"  ]
    ];

    foreach( $componente as $e ) {
        if( $e["is_array"] ) {
            $html  = str_replace( '{{'.$e["flag"].'}}', print_content( $e["data"], $e["tpl"] ), $html );
        } else {
            $html  = str_replace( '{{'.$e["flag"].'}}', single_print_content( $e["data"], $e["tpl"] ), $html );
        }
    }

    $html = preg_replace( '/\{\{.*\}\}/', '', $html );

    echo $html;