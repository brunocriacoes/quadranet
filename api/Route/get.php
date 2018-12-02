<?php

    $url     = $_REQUEST["urls"];
    $dominio = $url[1] ?? 1;
    $dir     = __DIR__ . "/../Data/{$dominio}";
    $is_dir  = file_exists( $dir );
    
    if( !$is_dir ):
        echo json_encode( [] );
        die;
    endif;

    $pastas  = scandir( $dir );
    $pastas  = array_filter( $pastas, function( $x ) { return stripos( $x, '.' ) === false; } );    
    
    $pastas  = array_reduce( $pastas, function( $acc, $x ) { 
        $acc->{$x} = (object) [
            "id"      => $x,
            "results" => []
        ];
        return $acc; 
    }, (object) []  );

    unset( $pastas->users );
    unset( $pastas->pagseguro );
    unset( $pastas->dominio );

    $pastas  = array_reduce( array_keys( (array) $pastas ), function( $acc, $x ) use ( $dir ) { 
        $local = "{$dir}/{$x}/";
        $all   = glob( "{$local}*.json*" );
        $all   = array_filter( $all, function( $e ) { return stripos( $e, 'index.json' ) === false; } );
        $all   = array_reduce( $all, function( $acc, $i ) {
            @$id = end( explode( '/', $i ) );
            $id = str_replace( '.json', '', $id );
            $acc->{$id} = json_decode( file_get_contents( $i ) );
            return $acc;
        }, (object)[] );
        $acc->{$x} = (object) [
            "id"      => $x,
            "results" => $all
        ];
        return $acc; 
    }, (object) []  );

    echo json_encode( $pastas );