<?php

    namespace Core;

    class Auth
    {
        private $method;
        private $base;
        private $PARAMS;
        private $parse;
        private $ID;
        private $user_base;
        
        function __construct( $PARAM )
        {
            $this->ID     = $PARAM['ID'] ?? '';
            $this->method = $PARAM['_method'] ?? '';
            $this->PARAMS =  $PARAM;
            $this->parse  =  $this->parse();
            $this->base();
            $this->dirs();
            $this->DIR( 'Data' );

            $dominio = $this->PARAMS['_dominio'];
            $dominio = empty( $dominio ) ? '' : "{$dominio}/";

            $user_base = "Data/{$dominio}users/";
            $this->DIR( $user_base );
            $this->indice( $user_base );
            $this->user_base = $user_base;
            $this->user_default();

        }

        function user_default()
        {
            $user  = [
                "ID"       => sha1('user@gmail.com'),
                "nome"     => "user",
                "email"    => "user@gmail.com",
                "password" => sha1( '123' )
            ];
            $local = "{$this->user_base}{$user['ID']}.json";
            if( ! file_exists( $local ) ):
                file_put_contents( $local, json_encode( $user ) );
            endif;
        }

        function base()
        {
            $dominio    = $this->PARAMS["_dominio"];
            $dominio    = empty( $dominio ) ? '' : "{$dominio}/";
            $url        = $this->PARAMS["urls"][0] ?? '';
            $url        = empty( $url ) ? '' : "{$url}/"; 
            $this->base = __DIR__ . "/../Data/{$url}";
        }

        function indice( $LOCAL )
        {
            $dir = __DIR__ . "/../{$LOCAL}index.json";
            if( ! file_exists( $dir ) ):
                file_put_contents( $dir, '{}' );
            endif;
        }

        function create_indice()
        {
            $index = $this->base . "index.json";
            $ID    = $this->ID;
            $json  = json_decode( file_get_contents( $index ) );
            $json->{$ID} = true;
            $json  =  json_encode( $json );
            file_put_contents( $index, $json );
        }

        function parse()
        {
            $par = $this->PARAMS;
            unset( $par['erros'] );
            unset( $par['_dominio'] );
            unset( $par['_method'] );
            unset( $par['_filds'] );
            unset( $par['_start'] );
            unset( $par['_count'] );
            unset( $par['urls'] );
            unset( $par['origin'] );
            return  $par;
        }

        function dirs()
        {
            $url    = $this->base;
            $url    = explode( 'Data', $url );
            $url    = $url[1];
            $url    = explode( '/', $url );
            $url    = array_filter( $url, function( $EL ) { return ! empty( $EL ); } );
            array_unshift( $url, 'Data' );
            foreach( $url as $k => $v ):
                $anterior = empty( $url[ $k - 1 ] ) ? '' : "{$url[ $k - 1 ]}/" ;
                $url[$k] = "{$anterior}{$v}";
            endforeach;
            foreach( $url as $v2 ):
                $v2 = "{$v2}/";
                $this->DIR( $v2 );
                $this->indice( $v2 );
            endforeach;
        }

        function DIR( $NAME = 0 )
        {
            $dir = __DIR__ . "./../{$NAME}";
            if( ! file_exists( $dir ) ):
                @mkdir( $dir, 0777, true );
            endif;
        }

        function DELETE()
        {
            $token       = $this->PARAMS["_token"] ?? '';
            $token_file  = "{$this->base}{$token}.json";
            $token_exist = file_exists( $token_file );
            if( $token_exist ):
                $token_json         = json_decode( file_get_contents( $token_file ) );
                $token_json->status = false;
                file_put_contents( $token_file, json_encode( $token_json ) );
            endif;
            echo json_encode( [
                "error" => false,
                "txt"   => "token desativado"
            ] );
        }

        function privado()
        {
            $token       = $this->PARAMS["_token"] ?? '';
            $token_file  = "{$this->base}../auth/{$token}.json";
            $token_exist = file_exists( $token_file );
            if( $token_exist ):
                $token_json         = json_decode( file_get_contents( $token_file ) );
                $token_exist        = $token_json->status == true;
            endif;
            if( !$token_exist ):
                echo json_encode( [
                    "error" => true,
                    "token" => $token,
                    "txt"   => $this->PARAMS['erros'][2] ?? 'erro não definido'
                ] );
                die;
            endif; 
        }

        function GET()
        {
            $token       = $this->PARAMS["_token"] ?? '';
            $token_file  = "{$this->base}{$token}.json";
            $token_exist = file_exists( $token_file );
            if( $token_exist ):
                $token_json         = json_decode( file_get_contents( $token_file ) );
                $token_exist        = $token_json->status == true;
            endif;
            $txt = ( $token_exist ) ? 'token valid' : 'token invalid';
            echo json_encode( [
                "error" => !$token_exist,
                "token" => $token,
                "txt"   => $txt
            ] );

            return !$token_exist;
        }

        function create_token( $USER = [] )
        {
            $token                = uniqid();
            $token_file           = "{$this->base}{$token}.json";
            $this->parse['ID']   = $token;
            $this->parse['USER'] = $USER;
            file_put_contents( $token_file, json_encode( $this->parse ) );
            echo json_encode( [
                "token" => $token,
                "error" => false
            ] );
        }

        function POST()
        {
            $email      = $this->PARAMS['emailCrip'];
            $senha      = $this->PARAMS['password'];
            $user       = $this->user_base;
            $user_file  = __DIR__ . "/../{$user}{$email}.json";
            $user_exist = file_exists( $user_file );
            $pass_valid = false; 
            if ( $user_exist ):
                $user_tmp   = json_decode( file_get_contents( $user_file ) );
                $pass_valid = $user_tmp->password === $senha ;
            endif;

            if ( $user_exist AND $pass_valid ):
                $this->create_token( $user_tmp );
            else:
                echo json_encode( [
                    "error" => $this->PARAMS['erros'][1] ?? 'erro não definido'
                ] );
            endif;
        }
        
        function rum()
        {
            switch ( $this->method ) 
            {
                case 'DELETE':
                    $this->DELETE();
                break;
                case 'POST':
                    $this->POST();
                break;
                case 'GET':
                    $this->GET();
                break;
               
            }
        }
    }
