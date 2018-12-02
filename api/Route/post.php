<?php

    $dominio = $_REQUEST['urls'][1] ?? '' ;
    $dominio = empty( $dominio ) ? '' : "{$dominio}/" ;
    $file    = $_REQUEST['urls'][2] ?? '' ;
    $file    = empty( $file ) ? '' : "{$file}/" ;
    $ID      = $_REQUEST['urls'][3] ?? 'index' ;

    $arquivo = __DIR__ . "/../Data/{$dominio}{$file}{$ID}.json";

    if( file_exists( $arquivo ) ):
        echo file_get_contents( $arquivo );
        die;
    endif;
    echo '{}';