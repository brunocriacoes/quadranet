<?php

    $error_dir = __DIR__ . "/../data/error/";
    maker_dir( $error_dir );
    
    if( method === 'POST' ):
        $json_file = $error_dir . request['id'] . ".json";
        if( ! file_exists( $json_file ) ):
            file_put_contents( $json_file, '{}' );
        endif;
        $json = json_decode( file_get_contents( $json_file ) );
        foreach( request as $key => $value ):
            $json->{$key} = $value;
        endforeach;
        $json_print = json_encode( $json );
        file_put_contents( $json_file, $json_print );    
        echo $json_print;
        die;
    endif;
 
    $json_file = $error_dir . request['id'] . ".json";
    if( method === 'GET' AND file_exists( $json_file ) ):
        echo file_get_contents( $json_file );
        die;
    endif;
   
    if( method === 'GET' ):
        $list = glob( "{$error_dir}*.json*" );
        $list = array_map( function( $DIR ) { return json_decode( file_get_contents( $DIR ) ); }, $list );
        $list = array_filter( $list, function( $EL ) { return $EL->status ?? false; } );
        $list = array_values( $list );
        $json_print = json_encode( $list );
        echo $json_print;
        die;
    endif;
