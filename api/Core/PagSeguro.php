<?php

    namespace Core;

    class PagSeguro
    {
        private $session  = 'https://ws.sandbox.pagseguro.uol.com.br/v2/sessions/';
        private $checkout = 'https://ws.sandbox.pagseguro.uol.com.br/v2/checkout/';
        public  $sandbox  = true;

        private $api_pag  = [
            "checkout"         => 'https://ws.pagseguro.uol.com.br/v2/checkout',
            "payment"          => 'https://pagseguro.uol.com.br/v2/checkout/payment.html?code=',
            "checkout_sandbox" => 'https://ws.sandbox.pagseguro.uol.com.br/v2/checkout',
            "payment_sandbox"  => 'https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html?code=',
        ];

        private $info = [
            "currency"  => 'BRL',
            "reference" => 'string',
        ];

        private $user = [
            "email" => 'br.rafael@hotmail.com',
            "token" => '4AA51B3309AE41DF8D94B0452D22CE56',
        ];
        
        public $items = [
                "itemId1"          => 'mechirica',
                "itemDescription1" => '42',
                "itemAmount1"      => '3.50',
                "itemQuantity1"    => '5',
                "itemWeight1"      => '1000',
        ];

        private $email, $senha;

        function __construct( $EMAIL, $TOKEN )
        {
            $this->email          = $EMAIL;
            $this->senha          = $TOKEN;
            $this->user["email"]  = $EMAIL;
            $this->user["token"]  = $TOKEN;
        }

        function post( $URI, $OBJ )
        {
            return $this->curl( 'POST' , $URI, ( array ) $OBJ );
        }

        function post_json( $URI, $OBJ )
        {
            $arr         = $this->curl( 'POST' , $URI, ( array ) $OBJ );
            $arr['body'] = json_decode( $arr['body'] );
            return $arr;
        }

        function post_xml( $URI, $OBJ )
        {
            $arr         = $this->curl( 'POST' , $URI,  $OBJ );
            $arr['body'] = simplexml_load_string( $arr['body'] );
            return $arr;
        }
        
        function get( $URI, $OBJ )
        {
            return $this->curl( 'GET' , $URI, ( array ) $OBJ );
        }

        function get_json( $URI, $OBJ )
        {
            $arr         = $this->curl( 'GET' , $URI, ( array ) $OBJ );
            $arr['body'] = json_decode( $arr['body'] );
            return $arr;
        }

        function get_xml( $URI, $OBJ )
        {
            $arr         = $this->curl( 'GET' , $URI, ( array ) $OBJ );
            $arr['body'] = simplexml_load_string( $arr['body'] );
            return $arr;
        }

        function obj_to_url( $PARAMS )
        {
            $PARAMS = http_build_query( $PARAMS );
            return $PARAMS;
        }

        function registre_cart()
        {
            return $this->post_xml( $this->session, [
                "email" => $this->email,
                "token" => $this->senha
            ] );
        }
        function buy()
        {
            return $this->post_xml( $this->api_pag['checkout_sandbox'], array_merge( $this->user, $this->info, $this->items ) );
        }
        function curl( $METHOD, $URI, $PARAMS )
        {
            $METHOD  = ( $METHOD == 'POST' ) ? true : false;
            $GET     = ( $METHOD == 'POST' ) ? '' : $this->obj_to_url( $PARAMS );
            $result  = [];
            $connet  = curl_init( $URI . $GET );

            curl_setopt( $connet, CURLOPT_HEADER, false );
            curl_setopt( $connet, CURLOPT_HTTPHEADER , [ "Content-Type: application/x-www-form-urlencoded; charset=ISO-8859-1;" ] );
            curl_setopt( $connet, CURLOPT_CONNECTTIMEOUT , 20 );
            curl_setopt( $connet, CURLOPT_RETURNTRANSFER, true );
            curl_setopt( $connet, CURLOPT_FOLLOWLOCATION, true );
            curl_setopt( $connet, CURLOPT_SSL_VERIFYPEER, false );

            if( $METHOD )
            {
                curl_setopt( $connet, CURLOPT_POST, true );
                curl_setopt( $connet, CURLOPT_POSTFIELDS, $this->obj_to_url( $PARAMS ) );
            } 

            $result['body']    = curl_exec( $connet );
            $result['headers'] = curl_getinfo( $connet, CURLINFO_HTTP_CODE );
            $result['error']   = curl_error ( $connet );

            curl_close( $connet );

            return $result;
        }        
        
    }