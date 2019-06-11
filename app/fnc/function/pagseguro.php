<?php

    $uri          = "https://ws.pagseguro.uol.com.br/v2/checkout";
    $uri_checkout = "https://pagseguro.uol.com.br/v2/checkout/payment.html?code=";
    $file         = __DIR__."/../../data/".dominio."/site/pagseguro.json";

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

    $credencial = getJson($file);

    function post( $url, $arr ) {
        $postdata = http_build_query($arr);
        $curl     = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postdata);
        $result = curl_exec($curl);
        curl_close( $curl );
        return $result;
    }

    $arr = [
        "email" => $credencial->email ?? '',
        "token" => $credencial->token ?? '',
        "currency" => "BRL",
        "reference" => "REF1234", 
        "shippingType" => "1",        
        "shippingAddressCountry" => "BRA",
    ];

    $iten = [
        "itemId1" => "0001",
        "itemDescription1" => "Notebook Prata",
        "itemAmount1" => "24300.00",
        "itemQuantity1" => "1",
        "itemWeight1" => "1000",
    ];

    $comprador = [
        "senderName" => "Jose Comprador",
        "senderAreaCode" => "11",
        "senderPhone" => "56273440",
        "senderEmail" => "comprador@uol.com.br",
    ];

    $loja = [
        "shippingAddressStreet" => "Av. Brig. Faria Lima",
        "shippingAddressNumber" => "1384",
        "shippingAddressComplement" => "5o andar",
        "shippingAddressDistrict" => "Jardim Paulistano",
        "shippingAddressPostalCode" => "01452002",
        "shippingAddressCity" => "Sao Paulo",
        "shippingAddressState" => "SP",        
    ];

    $arr               =  array_merge( $arr, request );
    $query             = post( $uri, $arr );
    if($query == 'Unauthorized') {
        echo('{"error": true}');
        die;
    }
    $xml               = simplexml_load_string( $query );
    $xml->uri_checkout = $uri_checkout . $xml->code ?? '';
    $json              = json_encode( $xml );

    echo $json;