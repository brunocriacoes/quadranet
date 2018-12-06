<?php

    if( ! empty( $_REQUEST['player-del'] ) AND ! empty( $_REQUEST['jogador'] ) ):
        $email     = $_REQUEST['player-del'] ?? '';
        $email     = sha1( $email );
        $id_user   = $_REQUEST['jogador'];
        $user_file = __DIR__ . "/../Data/" . dominio . "/usuario/{$email}.json";
        $valida    = file_exists( $user_file );
        if( $valida ):
            $json             = file_get_contents( $user_file ); 
            $json             = json_decode( $json );
            $json->tean       = array_filter(
                $json->tean,
                function( $item ) use ( $id_user )
                {
                    return $item->id != $id_user;
                }
            );
            file_put_contents( $user_file, json_encode( $json ) );
        endif;
        echo json_encode( [
            "error" => ! $valida,
            "data"  => $json->tean,
        ] );
        die();
    endif;

    if( ! empty( $_REQUEST['player-buy'] ) AND ! empty( $_REQUEST['usuario'] ) ):
        $email     = $_REQUEST['player-buy'] ?? '';
        $email     = sha1( $email );
        $id_user   = $_REQUEST['usuario'];
        $user_file = __DIR__ . "/../Data/" . dominio . "/usuario/{$email}.json";
        $valida    = file_exists( $user_file );
        if( $valida ):
            $json             = file_get_contents( $user_file ); 
            $json             = json_decode( $json );
            $json->tean    = array_map( function( $play ) use ( $id_user ) {
                if( $id_user == $play->id ):
                    $play->status = ! $play->status;
                    return $play;
                else:
                    return $play;
                endif;
            }, $json->tean );
            file_put_contents( $user_file, json_encode( $json ) );
        endif;
        echo json_encode( [
            "error" => ! $valida,
            "data"  => $json->tean,
        ] );
        die();
    endif;

    if( ! empty( $_REQUEST['add-player'] ) ):
        $email     = $_REQUEST['add-player'] ?? '';
        $email     = sha1( $email );
        $name      = $_REQUEST['name']       ?? '';
        $tel       = $_REQUEST['tel']        ?? '';
        $mail      = $_REQUEST['mail']       ?? '';
        $id        = uniqid();
        $user_file = __DIR__ . "/../Data/" . dominio . "/usuario/{$email}.json";
        $valida    = file_exists( $user_file );
        if( $valida ):
            $json             = file_get_contents( $user_file ); 
            $json             = json_decode( $json );
            $json->tean[]     = [
                "id"      => $id,
                "name"    => $name,
                "tel"     => $tel,
                "mail"    => $mail,
                "status"  => false,
            ];            
            file_put_contents( $user_file, json_encode( $json ) );
        endif;
        echo json_encode( [
            "error" => ! $valida,
            "data"  => $_REQUEST,
        ] );
        die();
    endif;

    if( ! empty( $_REQUEST['atualizar'] ) ):
        $email     = $_REQUEST['atualizar'] ?? '';
        $email     = sha1( $email );
        $user_file = __DIR__ . "/../Data/" . dominio . "/usuario/{$email}.json";
        $valida    = file_exists( $user_file );
        if( $valida ):
            $json           = file_get_contents( $user_file ); 
            $json           = json_decode( $json );
            $json->title    = $_REQUEST['nome']    ?? '';
            $json->apelido  = $_REQUEST['apelido']  ?? '';
            $json->whatsapp = $_REQUEST['whatsapp'] ?? '';
            file_put_contents( $user_file, json_encode( $json ) );
        endif;
        echo json_encode( [
            "error" => ! $valida,
            "data"  => $_REQUEST,
        ] );
        die();
    endif;

    if( ! empty( $_REQUEST['cadastrar'] ) ):
        $_REQUEST['error'] = false;
        $dirs = [
            "dominio_dir" => __DIR__ . "/../Data/" . dominio . "/",
            "user_dir"    => __DIR__ . "/../Data/" . dominio . "/usuario/",
        ];
        array_map( function( $dir ) {
            if ( ! file_exists( $dir ) ):
                mkdir( $dir );
            endif;
        }, $dirs );
        $index = __DIR__ . "/../Data/" . dominio . '/usuario/index.json';
        if( ! file_exists( $index ) ):
            file_put_contents( $index, '{}' );
        endif;
        $index_json = json_decode( file_get_contents( $index ) );
        $id = sha1( $_REQUEST['email'] ?? '123' );
        $id_dir = __DIR__ . "/../Data/" . dominio . "/usuario/{$id}.json";
        if( ! file_exists( $id_dir ) ):
            $_REQUEST['ID'] = $id;
            file_put_contents( $id_dir, json_encode( $_REQUEST ) );
            $index_json->{$id} = true;
            file_put_contents( $index, json_encode( $index_json ) );
        endif;
        echo json_encode( $_REQUEST );
        die();
    endif;

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
        $user_id   = $json->usuario ?? '';
        $user_file = __DIR__ . "/../Data/" . dominio . "/usuario/{$user_id}.json";
        $valida    = file_exists( $user_file );
        if( $valida ):
            $json    = file_get_contents( $user_file );
            $json    = json_decode( $json );
            $dir_buy = __DIR__ . "/../Data/" . dominio . "/buy/";
            if( file_exists( $dir_buy ) ):
                $loop   = glob( "{$dir_buy}*.json*" );                
                $hitory = array_map( function( $iten ) {
                    $j  = file_get_contents( $iten );
                    $j  = json_decode( $j );
                    return $j;
                }, $loop );
                @$hitory = array_filter( $hitory, function( $item ) use ( $user_id ) { return sha1( $item->email ) == $user_id; } );
                @$hitory = array_values( $hitory );
            endif;
            echo json_encode( [
                "id"          => $json->id        ?? "12QDSW234DASD231SD",
                "name"        => $json->title     ?? "name",
                "nickname"    => $json->apelido   ?? "nickname",
                "email"       => $json->email     ?? "email@gmail.com",
                "whatsapp"    => $json->whatsapp  ?? "+0 (00) 0 0000-0000",
                "history"     => $hitory          ?? [],
                "tean"        => $json->tean      ?? [], 
                "error"       => (boolean) $valida,
                "mensage"     => $valida ? "token valido" : "token invalido"
            ] );
        else:
            echo json_encode( [
                "error"    => (boolean) $valida,
                "mensage"  => $valida ? "token valido" : "token invalido"
            ] );
        endif;
        die();
    endif;

    if( ! empty( $_REQUEST['alter-pass'] ) AND ! empty( $_REQUEST['pass'] ) ):
        $email     = $_REQUEST['alter-pass'] ?? '';
        $email     = sha1( $email );
        $user_file = __DIR__ . "/../Data/" . dominio . "/usuario/{$email}.json";
        $valida    = file_exists( $user_file );
        if( $valida ):
            $json           = file_get_contents( $user_file ); 
            $json           = json_decode( $json );
            $json->pass     = $_REQUEST['pass'];
            file_put_contents( $user_file, json_encode( $json ) );
        endif;
        echo json_encode( [
            "error"   => ! $valida,
            "mensage" => $valida ? "senha atualizada com sucesso" : "erro ao atualizar senha"
        ] );
        die();
    endif;

    if( ! empty( $_REQUEST['recovery-pass'] ) ):
        $email = $_REQUEST['recovery-pass'] ?? '123';
        $id    = sha1( $email );
        $id_dir = __DIR__ . "/../Data/" . dominio . "/usuario/{$id}.json";
        if( file_exists( $id_dir ) ):
            $_REQUEST['ID'] = $id;
            $json = file_get_contents( $id_dir );
            $new_pass      = uniqid(); 
            $json->pass    = sha1( $new_pass );
            $json->passord = sha1( $new_pass );
            file_put_contents( $id_dir, json_encode( $json ) );

            $headers  = "From: sac@quadranet.com.br" . "\r\n";
            $headers  = "MIME-Version: 1.0" . "\r\n";
            $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        
            $error = mail( $email, 'nova senha', "sua nova senha é : {$new_pass}", $headers );
        endif;
        echo json_encode( [
            "error"   => $error,
            "mensage" => "foinova senha gerada"
        ] );
        die();
    endif;

    echo json_encode( [
        "error"   => true,
        "mensage" => "token invalido"
    ] );