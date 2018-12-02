<?php

    echo json_decode( [
        "error" : false,
        "mensage": "carrinho registrado"
    ] );

    $buy_dir = __DIR__ . "/../Data/" . dominio . "/buy/";
    if( ! file_exists( $buy_dir ) ):
        mkdir( $buy_dir );
    endif;

    if( isset( $_REQUEST['create'] ) ):
        $transaction = $_REQUEST['transaction'] ?? uniqid();
        die();
    endif;