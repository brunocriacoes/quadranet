<?php

    $user_dir = __DIR__ . "/../data/" . dominio . "/_user/";
    maker_dir( $user_dir ); 

    $token_dir = __DIR__ . "/../data/" . dominio . "/token/";
    maker_dir( $token_dir );

    $user_default = require __DIR__ . "/user_default.php";
    file_put_contents( $user_dir . sha1( 'user@gmail.com' ) . ".json", json_encode( $user_default ) );

    $endPoints = [
        "update"          =>  uri . "/app/auth2?update={{userId}}", 
        "token"           =>  uri . "/app/auth2?token={{tokenId}}", 
        "logout"          =>  uri . "/app/auth2?logout={{tokenId}}", 
        "login"           =>  uri . "/app/auth2?login=1&email={{userEmail}}&pass={{userPass}}", 
        "create"          =>  uri . "/app/auth2?create=1", 
        "profile"         =>  uri . "/app/auth2?profile={{tokenId}}", 
        "alter-pass"      =>  uri . "/app/auth2?alter-pass={{userId}}&pass={{newPass}}", 
        "recuperar-senha" =>  uri . "/app/auth2?recuperar-senha={{userEmail}}", 
        "allUser"         =>  uri . "/app/auth2"
    ];

    function getJson( $file ) {
        if( ! file_exists( $file ) ) file_put_contents( $file, '{}' );
        return json_decode( file_get_contents( $file ) );
    }

    function setJson( $file, $json ) {
        if( ! file_exists( $file ) ) file_put_contents( $file, '{}' );
        $item = json_decode( file_get_contents( $file ) );
        foreach( $json as $indice => $valor ) {
            $item->{$indice} = $valor;
        }
        file_put_contents( $file, json_encode( $item ) );
        return $item;
    }

    if( ! empty( request['endpoints'] ) ):        
        echo json_encode( $endPoints );
        die;
    endif;

    if( ! empty( request['update'] ) ):
        $id        = request['update'];
        $request   = request;
        $user_file = "{$user_dir}{$id}.json";
        unset( $request['update'] );
        $result    = setJson( $user_file, $request );    
        unset(  $result->pass );
        unset(  $result->password );
        echo json_encode( $result );
        die;
    endif;
    
    if( ! empty ( request['token'] ) ):
        $id   = request['token'];
        $file = "{$token_dir}{$id}.json";
        if( file_exists( $file ) ) $valid = true;
        echo json_encode( [ "token" => $valid ?? false ] );
        die;
    endif;

    if( ! empty ( request['logout'] ) ):
        $token_file = $token_dir . request['logout'] . ".json";
        if( file_exists( $token_file ) ) unlink( $token_file );
        echo json_encode( [ "logout" => true, "mensagem" => "deslogado do sistema com sucesso" ] );
        die;
    endif;

    if( ! empty ( request['login'] ) AND !empty( request['pass'] ) AND !empty( request['email'] ) ):
        $id                  = sha1( request['email'] );
        $userFile            = "{$user_dir}{$id}.json";
        if( file_exists( $userFile ) ):
            $user            = getJson( $userFile );
            $status          = (boolean)$user->status ?? false;
            $pass            = $user->pass === request['pass'] ? true : false;
            if( $status && $pass ) :
                $tokenId     = uniqid();
                $tokenFile   = "{$token_dir}{$tokenId}.json";
                setJson( $tokenFile, [
                    "userId" => sha1( request['email'] ),
                    "email"  => request['email']
                ] );
                echo json_encode( [ "error" => false, "token" => $tokenId, "mensagem" => "Logado com sucesso" ] );
            endif;
            die;
        endif;
        echo json_encode( [ "error" => true, "token" => '', "mensagem" => "Usuário ou senha esta errado" ] );
        die;
    endif;

    if( ! empty ( request['create'] ) ):
        $request      =  request;
        unset( $request['create'] );
        $id            = sha1( $request['email'] );
        $file          = "{$user_dir}{$id}.json";
        $request['id'] = $id;
        $result        = setJson( $file, $request );       
        echo json_encode( $result );
        die;
    endif;

    if( ! empty ( request['profile'] ) ):
        $id           = request['profile'];
        $file         = "{$token_dir}{$id}.json";
        if( file_exists( $file ) ) {
            $token    = getJson( $file );
            $userFile = "{$user_dir}{$token->userId}.json";
            $user     = getJson( $userFile );
            unset( $user->pass );
            unset( $user->password );
            unset( $user->ativo );
            unset( $user->status );
            unset( $user->domain );
            echo json_encode( $user );
            die;
        }   
        echo json_encode( [ "erro" => true, "mensagem" => "Token invalido"] );
        die;
    endif;

    if( !empty( request['alter-pass'] ) && !empty( request['pass'] ) ):
        $request               = request;
        $request['id']         = request['alter-pass'];
        $request['pass']       = sha1( request['pass'] );
        $request['password']   = sha1( request['pass'] );
        $user_file             = "{$user_dir}{$request['id']}.json";
        unset( $request['alter-pass'] );
        if( file_exists( $user_file ) ) setJson( $user_file, $request );       
        echo json_encode( [ "erro" => false, "mensagem" => "Senha alterada com sucesso"] );
        die;
    endif;

    if( ! empty ( request['recuperar-senha'] ) ):
        $id       = sha1( request['recuperar-senha'] );
        $file     = "{$user_dir}{$id}.json";
        $newPass  = uniqid();
        $headers  = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= 'From: <sistema@'.dominio.'>' . "\r\n";
        if( file_exists( $file ) ) {
            $json = getJson( $file );
            $json->pass     = sha1( $newPass );
            $json->password = sha1( $newPass );
            setJson( $file, $json );
            @mail( $json->email,"Sua noma senha","sua nova senha é: {$newPass}",$headers);
        }
        echo json_encode( [ "erro" => false, "mensagem" => "Nova senha enviada por email"] );
        die;
    endif;

    $lista = glob( "{$user_dir}*.json*" );
    $lista = array_map( function( $file ) {
        $json = getJson( $file ) ;
        unset( $json->pass );
        unset( $json->password );
        return $json;
    }, $lista );
    $lista = array_filter( $lista, function( $e ) { return (boolean)$e->status ?? false; } );
    $lista = array_values( $lista );
    echo json_encode( $lista );
