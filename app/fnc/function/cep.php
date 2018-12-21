<?php
   
    $cep = urls[2] ?? '';
    $cep = str_replace( ['-',' '], ['',''], $cep );
    $url = "https://viacep.com.br/ws/{$cep}/json/";
    
    if( strlen( $cep ) == 8 ):
        $json = file_get_contents( $url );
        $json = json_decode( $json );
        echo json_encode( [
            "zip_code"  => $cep,
            "address"   => $json->logradouro,
            "community" => $json->bairro,
            "state"     => $json->localidade,
            "city"      => $json->uf,
        ] );
    endif;
