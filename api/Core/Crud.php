<?php

    namespace Core;

    class Crud
    {

        private $method;
        private $base;
        private $PARAMS;
        private $parse;
        private $ID;
        
        function __construct( $PARAM )
        {
            $this->ID     = $PARAM['ID'] ?? '';
            $this->method = $PARAM['_method'] ?? '';
            $this->PARAMS =  $PARAM;
            $this->parse  =  $this->parse();
            $this->base();
            $this->dirs();
            $this->DIR( 'Data' );
        }

        function base()
        {
            $dominio    = $this->PARAMS["_dominio"];
            $dominio    = empty( $dominio ) ? '' : "{$dominio}/";
            $url        = $this->PARAMS["urls"][0] ?? '';
            $url        = empty( $url ) ? '' : "{$url}/"; 
            $this->base = __DIR__ . "/../Data/{$dominio}{$url}";
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

        function GET()
        {
            if( ! empty( $this->ID ) ):
                @$this->GETONE();
            else:
                @$this->GETONES();
            endif;
        }

        function GETONE()
        {
            $file   = "{$this->base}{$this->ID}.json";
            if( file_exists( $file ) ):
                $json   = json_decode( file_get_contents( $file ) );                
            endif;
            echo json_encode( $this->FILDES( $json ) );
        }
        
        function GETONES()
        {
            $index      = "{$this->base}index.json";
            $index_json = [];
            // if( file_exists( $index ) ):
                $index_json = (array) json_decode( file_get_contents( $index ) );
            // endif;
            $ativos     = array_filter( $index_json, function( $EL ) { return $EL; } );
            $start      = $this->PARAMS['_start'];
            $count      = $this->PARAMS['_count'];
            $crop       = array_slice( $ativos, $start, $count );
            $result     = array_map( function( $ID ) {
                $file   = "{$this->base}{$ID}.json";
                $json   = [];                
                if( file_exists( $file )  ):
                    $json   = json_decode( file_get_contents( $file ) );                
                endif;
                return $this->FILDES( $json );
            }, array_keys( $crop ) );
            echo json_encode( $result );
        }

        function FILDES( $JSON )
        {
            $fildes   = $this->PARAMS['_filds'];
            $fildes   = explode( ',', $fildes );
            $fildes   = array_filter( $fildes, function( $EL ) { return ! empty( $EL ); } );
            $fildes[] = "ID";
            $result   = [];
            foreach( $fildes as $k ):
                @$result[$k] = $JSON->{$k};
            endforeach;
            $result['params'] = implode( ', ', array_keys( (array) $JSON ) );
            return $result;
        }
        
        function POST()
        {
            $this->create_indice();
            $ID      = $this->ID;
            $index   = $this->base . "{$ID}.json";
            $content = $this->parse;
            $json    =  json_encode( $content );
            file_put_contents( $index, $json );
            echo $json;
        }
        
        function DELETE()
        {
            $index = $this->base . "index.json";
            $ID    = $this->ID;
            $json  = json_decode( file_get_contents( $index ) );
            $json->{$ID} = false;
            $json  =  json_encode( $json );
            file_put_contents( $index, $json );
            echo '{ "error": "false", "error_text" : "apagado com sucesso"  }';
        }
        
        function PUT()
        {
            $ID      = $this->ID;
            $index   = $this->base . "{$ID}.json";
            $content = $this->parse;
            $json    = (object) [];
            if( file_exists( $index ) ):
                $json    = json_decode( file_get_contents( $index ) );
            endif;
            foreach( $content as $k => $v ):
                @$json->{$k} = $v;
            endforeach;
            $json    =  json_encode( $json );
            file_put_contents( $index, $json );
            echo $json;
        }
        
        function rum()
        {
            switch ( $this->method ) 
            {
                case 'GET':
                    $this->GET();
                break;
                case 'POST':
                    $this->POST();
                break;
                case 'DELETE':
                    $this->DELETE();
                break;
                case 'PUT':
                    $this->PUT();
                break;
            }
        }
        
    }