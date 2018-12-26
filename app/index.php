<?php 

    require __DIR__ . "/core/boot.php";

    $data_dir = __DIR__ . "/data/";
    maker_dir( $data_dir );   

    $dominio_dir = __DIR__ . "/data/" . dominio . "/";
    maker_dir( $dominio_dir );

    $file_name = urls[1] ?? '';
    $file_dir  = __DIR__ . "/route/{$file_name}.php";
    if( file_exists( $file_dir ) ):
        require $file_dir;
        die;
    endif;

    $dirs = array_reduce( urls, function( $ACC, $ITEM ) {
        $ACC[] = end($ACC) . "/{$ITEM}";
        return $ACC;
    }, [] );

    $this_dir = __DIR__ . "/data/". dominio . end($dirs) . "/";

    foreach( $dirs as $name_dir ):
        maker_dir( __DIR__ . "/data/". dominio . $name_dir . "/" );
    endforeach;

    $valid = ! empty( count( urls ) );

    if( method === 'POST' AND $valid ):
        $json_file = $this_dir . request['id'] . ".json";
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

    $json_file = $this_dir . request['id'] . ".json";
    if( method === 'GET' AND file_exists( $json_file ) AND $valid ):
        echo file_get_contents( $json_file );
        die;
    endif;

    if( method === 'GET' AND $valid ):
        $list = glob( "{$this_dir}*.json*" );
        $list = array_map( function( $DIR ) { return json_decode( file_get_contents( $DIR ) ); }, $list );
        $list = array_filter( $list, function( $EL ) { return $EL->status ?? false; } );
        $json_print = json_encode( $list );
        echo $json_print;
        die;
    endif;
    
    $lista_dir = scandir( $dominio_dir );
    $lista_dir = array_slice( $lista_dir, 2 );
    $lista_dir = array_filter( $lista_dir, function( $dir ) { return is_dir( __DIR__ . "/data/" . dominio . "/". $dir ) AND ! stripos( $dir, '.' ); } );
    $lista_dir = array_reduce( $lista_dir, function( $acc, $dir ) {
        $list = glob( __DIR__ . "/data/" . dominio . "/". $dir ."/*.json*" );
        $list = array_map( function( $DIR ) { return json_decode( file_get_contents( $DIR ) ); }, $list );
        $list = array_filter( $list, function( $EL ) { return $EL->status ?? false; } );
        $acc[$dir] = $list;
        return $acc;
    } , [] );
    unset( $lista_dir['upload'] );
    unset( $lista_dir['_user'] );
    unset( $lista_dir['pagseguro'] );
    echo json_encode( $lista_dir );
