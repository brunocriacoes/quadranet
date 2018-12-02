<?php 

    $dominio = $_REQUEST['_dominio'] ?? '';
    $dominio = empty( $dominio ) ? '' : "{$dominio}/";
    $id      = $_REQUEST['id'] ?? '';

    $indice  = __DIR__ . "/../Data/{$dominio}reserva/index.json";
    $json    =  (object) [];

    if( file_exists( $indice ) ):
        $json = json_decode( file_get_contents( $indice ) );
    endif;

    $json->{$id} = false;

    file_put_contents( $indice, json_encode( $json ) );

    echo json_encode( [
        "error" => false,
        "text"  => "reserva deletada com sucesso",
        "id"    => $id
    ] );