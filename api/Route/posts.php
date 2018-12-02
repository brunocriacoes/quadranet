<?php

    $ID      = $_REQUEST['urls'][1] ?? false;
    $dominio = empty( $_REQUEST['_dominio'] ) ? '' : "{$_REQUEST['_dominio']}/";
    $is_db   = __DIR__ . "/../Data/{$dominio}{$ID}/index.json"; 

    if( file_exists( $is_db ) ):
        $select = (array) json_decode( file_get_contents( $is_db ) );
        $arr    = array_filter( $select, function( $Y ) { return $Y; } );
        $ids    = array_keys( $arr );
        $select = array_reduce( $ids, function( $ACC, $EL ) use ( $dominio, $ID ) {
            $file = __DIR__ . "/../Data/{$dominio}{$ID}/{$EL}.json";
            if( file_exists( $file ) ):
                $ACC[] = json_decode( file_get_contents( $file ) );
                return $ACC;
            endif;
        }, [] );
        $select = json_encode( $select );
    endif;

    echo $select ?? '[]';
