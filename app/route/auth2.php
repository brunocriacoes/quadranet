<?php

    $user_dir = __DIR__ . "/../data/" . dominio . "/_user/";
    maker_dir( $user_dir ); 

    $token_dir = __DIR__ . "/../data/" . dominio . "/token/";
    maker_dir( $token_dir ); 

    file_put_contents( $user_dir . sha1( 'user@gmail.com' ) . ".json", json_encode( [
        "nome"        => 'usuario',
        "telephone"   => '+55 (00) 0 0000-0000',
        "pass"        => sha1( '123' ),
        "email"        => 'user@gmail.com',
        "id"          => sha1( 'user@gmail.com' ),
        "admin"       => 1,
        "domain"      => 1,
        "ativo"       => 1,
        "status"      => true,
    ] ) );

    if( ! empty( request['update'] ) ):
        $id        = sha1( request['email'] );
        $user_file = "{$user_dir}{$id}.json";
        $user      = json_decode( file_get_contents( $user_file ) );
        foreach( request as $k => $v ):
            $user->{$k} = $v;
        endforeach;
        
        file_put_contents( $user_file, json_encode( $user ) );
        unset(  $user->pass );
        unset(  $user->password );
        echo json_encode( $user );
        die;
    endif;
    
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
        $email     = request['email'];
        $pass      = request['pass'];
        $id        = sha1( request['email'] );
        $user_file = $user_dir . $id . ".json";
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
        $id        = sha1( request['email'] );
        $file      = $user_dir . $id . ".json";
        if( ! file_exists( $file ) ) :
            file_put_contents( $file, '{}' );
        endif;
        $json = json_decode( file_get_contents( $file ) );
        foreach( request as $k => $v ):
            @$json->{$k} = $v;
        endforeach;
        file_put_contents( $file, json_encode( $json  ) );
        echo json_encode( $json );
        die;
    endif;

    if( ! empty ( request['profile'] ) ):
        $id                 = request['profile'];
        $profile_token      = $token_dir . $id . ".json";      
        $json               = json_decode( file_get_contents( $profile_token ) );
        $user               = json_decode( file_get_contents(  $user_dir . sha1( $json->user ) . ".json"  ) );
        unset( $user->pass );
        unset( $user->ativo );
        unset( $user->status );
        unset( $user->domain );
        echo json_encode( $user );
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

    if( ! empty ( request['recuperar-senha'] ) ):
        
    endif;

    $lista = glob( "{$user_dir}*.json*" );
    $lista = array_map( function( $e ) {
        $json = json_decode( file_get_contents( $e ) );
        unset( $json->pass );
        return $json;
    }, $lista );
    $lista = array_filter( $lista, function( $e ) { return $e->status ?? false; } );
    $lista = array_values( $lista );
    echo json_encode( $lista );
