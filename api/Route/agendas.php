<?php

    $url     = $_REQUEST["urls"];
    $dominio = $_REQUEST["_dominio"] ?? '';
    $ID      = $_REQUEST['ID'];

    function getJson( $FILE )
    {
        if( file_exists( $FILE ) ):
            return json_decode( file_get_contents( $FILE ) );
        else:
            return [];
        endif;
    }

    $dom      = empty( $dominio ) ? '' : "{$dominio}/";
    $dir      = __DIR__ . "/../Data/{$dom}agenda/*.json*";
    $list     = glob( $dir );

    $map      = array_map( function( $LOCAL ) {
        return getJson( $LOCAL );
    }, $list );

    $filter  = array_filter( $map, function( $EL ) use ( $ID ) {
        $status   = $EL->status ?? false;
        $quadra   = $EL->quadra ?? '';
        $isQuadra = $ID === $quadra;
        return  $status AND $isQuadra;
    } );

    $result = $filter;

    echo json_encode( $result ?? [] );
