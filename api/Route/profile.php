<?php

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
        $id = sha1( $_REQUEST['email'] ?? '123' );
        $id_dir = __DIR__ . "/../Data/" . dominio . "/usuario/{$id}.json";
        if( ! file_exists( $id_dir ) ):
            $_REQUEST['ID'] = $id;
            file_put_contents( $id_dir, json_encode( $_REQUEST ) );
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
        if( $valida ):
            echo json_encode( [
                "id"     => "12QDSW234DASD231SD",
                "name"     => "Bolinha",
                "nickname" => "Ranheta",
                "email"    => "teste@gmail.com",
                "whatsapp"    => "+0 (00) 0 0000-0000",
                "history" => [ 
                    [
                        
                        "id" => "QWF1SAD123ASD123",
                        "status" => 1,
                        "day" => "2018-11-09-09-00",
                        "price" => "200",
                        "cart" => [
                            [
                                "name" => "tubarão",
                                "id_quadra" => "QWF1SAD123ASD123",
                                "avulso" => "",
                                "init" => "",
                                "end" => "",
                                "mensak" => "",
                                "type" => 1
                            ]
                        ],
                        
                    ],
                 ],
                "tean" => [
                    [
                        "name" => "Ranheta",
                        "tel" => "",
                        "mail" => "",
                    ],
                    [
                        "name" => "Dudud",
                        "tel" => "",
                        "mail" => "",
                    ],
                ],
                "error"    => (boolean) $valida,
                "mensage"  => $valida ? "token valido" : "token invalido"
            ] );
        else:
            echo json_encode( [
                "error"    => (boolean) $valida,
                "mensage"  => $valida ? "token valido" : "token invalido"
            ] );
        endif;
        die();
    endif;

    if( ! empty( $_REQUEST['alter-pass'] ) ):
        $email = $_REQUEST['alter-pass'];
        $valid = $_REQUEST['alter-pass'] === "teste@gmail.com";
        echo json_encode( [
            "error"   => (boolean) $valida,
            "mensage" => $valida ? "nova senha gerada" : "email não existe"
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