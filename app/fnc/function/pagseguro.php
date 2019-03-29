<?php

    $uri          = "https://ws.pagseguro.uol.com.br/v2/checkout";
    $uri_checkout = "https://pagseguro.uol.com.br/v2/checkout/payment.html?code=";

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
        "email" => "br.rafael@hotmail.com",
        "token" => "1E6B06B81C5B493A81218C1D522C229F",
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
    $xml               = simplexml_load_string( $query );
    $xml->uri_checkout = $uri_checkout . $xml->code ?? '';
    $json              = json_encode( $xml );

    echo $json;