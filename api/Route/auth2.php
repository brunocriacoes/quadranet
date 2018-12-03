<?php

    if( ! empty( $_REQUEST['token'] ) ):
        $token     = $_REQUEST['token'];
        $dir_token = __DIR__ . "/../Data/" . dominio . "/token/";
        if( ! file_exists( $dir_token ) ):
            mkdir( $dir_token );
        endif;
        $token_dir = "{$dir_token}{$token}.json";
        $valida    = file_exists( $token_dir );
        if( $valida ):
            $json = file_get_contents( $token_dir );
            $json = json_decode( $json );
            $valida = $json->status ?? false;
        endif;
        echo json_encode( [
            "error"   => ! $valida,
            "mensage" => $valida ? "token valido" : "token invalido"
        ] );
        die();
    endif;

    if( ! empty( $_REQUEST['pass'] ) ):        
        $email    = $_REQUEST['email'] ?? '123';
        $id       = sha1( $email );
        $pass     = $_REQUEST['pass'];
        $is_email = $email === "teste@gmail.com";
        $is_pass  = $pass === sha1( '123' );
        $dir_user = __DIR__ . "/../Data/" . dominio . "/usuario/{$id}.json";
        $valid    = file_exists( $dir_user );
        $token    = null;
        if( $valid ):
            $json = file_get_contents( $dir_user );
            $json = json_decode( $json );
            if( $json->pass == $pass ):
                $token = uniqid();
                $dir_token = __DIR__ . "/../Data/" . dominio . "/token/";
                if( ! file_exists( $dir_token ) ):
                    mkdir( $dir_token );
                endif;
                file_put_contents( "{$dir_token}{$token}.json", json_encode( [
                    "ID"      => $token,
                    "usuario" => $id,
                    "status"  => true,
                ] ) );
            else:
                $valid = false;
            endif;
        else:
            $valid = false;
        endif;
        echo json_encode( [
            "error"   => ! $valid,
            "mensage" => $valid ? "dados valido" : "dados invalido",
            "token"   => $token,
        ] );
        die();
    endif;

    if( ! empty( $_REQUEST['logout'] ) ):

        $token     = $_REQUEST['logout'];
        $dir_token = __DIR__ . "/../Data/" . dominio . "/token/";
        if( ! file_exists( $dir_token ) ):
            mkdir( $dir_token );
        endif;
        $token_dir = "{$dir_token}{$token}.json";
        $valida    = file_exists( $token_dir );
        if( $valida ):
            $json = file_get_contents( $token_dir );
            $json->status = false;
            file_put_contents( $token_dir, json_decode( $json ) );
        endif;
        echo '{ "error": false, "mensage": "deslogado com sucesso" }';
        die();
    endif;

    echo '{ "error": true, "mensage" : "não a dados" }';