<?php

    $buy_dir = __DIR__ . "/../Data/" . dominio . "/buy/";
    $index   = __DIR__ . "/../Data/" . dominio . "/buy/index.json";
    if( ! file_exists( $buy_dir ) ):
        mkdir( $buy_dir );
    endif;
    if( ! file_exists( $index ) ):
        file_put_contents( $index, '{}' );
    endif;
    $index_json = json_decode( file_get_contents( $index ) );
    if( isset( $_REQUEST['register'] ) AND ! empty( $_REQUEST['cart'] ) ):
        $id                         = $_REQUEST['register'] ?? '';
        $cart                       = urldecode( $_REQUEST['cart'] ?? '{}' );
        $cart                       = str_replace( '\\', '', $cart );
        $file_cart                  = __DIR__ . "/../Data/" . dominio . "/buy/{$id}.json";
        $transaction                = $_REQUEST['register'] ?? sha1( uniqid() );
        $index_json->{$transaction} = true;
        file_put_contents( $index, json_encode( $index_json ) );
        file_put_contents( $file_cart, $cart );        
    endif;
    echo json_encode( [
        "error"   => false,
        "mensage" => "carrinho registrado",
        "cart"    => $cart ?? []
    ] );