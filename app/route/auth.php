<?php

    $user_dir = __DIR__ . "/../data/user/";
    maker_dir( $user_dir );   

    $token_dir = __DIR__ . "/../data/token/";
    maker_dir( $token_dir );

    file_put_contents( $user_dir . sha1( 'user@gmail.com' ) . ".json", json_encode( [
        "pass"   => sha1( '123' ),
        "mail"   => 'user@gmail.com',
        "id"     => sha1( 'user@gmail.com' ),
        "status" => true,
    ] ) );
    
    if( ! empty ( request['token'] ) ):
        $token_file = $token_dir . request['token'] . ".json";
        if( file_exists( $token_file ) ):
            $json  = json_decode( file_get_contents( $token_file ) );
            $valid = $json->status ?? false;
        endif;
        echo json_encode( [ "token" => $valid ?? false ] );
        die;
    endif;

    if( ! empty ( request['logout'] ) ):
        $token_file = $token_dir . request['logout'] . ".json";
        if( file_exists( $token_file ) ):
            $json         = json_decode( file_get_contents( $token_file ) );
            $json->status = false;
            file_put_contents( $token_file, json_encode( $json ) );
        endif;
        echo json_encode( [ "logout" => true ] );
        die;
    endif;

    if( ! empty ( request['login'] ) ):
        $data      = explode( ',', request['login'] );
        $email     = sha1( $data[0] ?? '' );
        $pass      = sha1( $data[1] ?? '' );
        $user_file = $user_dir . $email . ".json";
        if( file_exists( $user_file ) ):
            $json         = json_decode( file_get_contents( $user_file ) );
            $valid_status = $json->status ?? false;
            $valid_pass   = $json->pass === $pass;
            $valid        = $valid_pass === true;
            if( $valid ) :
                file_put_contents( $token_dir. request['id'] . ".json", json_encode( [
                    "status" => true,
                    "user"   => $email
                ] ) );
            endif;
        endif;
        echo json_encode( [ "login" => $valid ?? false, "token" => request['id'] ] );
        die;
    endif;

    if( ! empty ( request['create'] ) ):
        $data      = explode( ',', request['create'] );
        $email     = sha1( $data[0] ?? '' );
        $pass      = sha1( $data[1] ?? '' );
        $user_file = $user_dir . $email . ".json";
        if( ! file_exists( $user_file ) ):
            file_put_contents( $user_file, json_encode( [
                "pass"   => $pass,
                "mail"   => $data[0] ?? '',
                "id"     => $email,
                "status" => true
            ] ) );
            $valid = true; 
        endif;
        echo json_encode( [ "create" => $valid ?? false ] );
        die;
    endif;

    if( ! empty ( request['alter-pass'] ) ):
        $data      = explode( ',', request['alter-pass'] );
        $email     = sha1( $data[0] ?? '' );
        $pass      = sha1( $data[1] ?? '' );
        $user_file = $user_dir . $email . ".json";
        if( file_exists( $user_file ) ):
            $json         = json_decode( file_get_contents( $user_file ) );
            $json->pass   = $pass;
            $valid        = true; 
            file_put_contents( $user_file, json_encode( $json ) );
        endif;
        echo json_encode( [ "alter-pass" => $valid ?? false ] );
        die;
    endif;
    