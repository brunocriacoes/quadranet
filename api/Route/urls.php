<?php

    $dominios = include __DIR__ . "/../theme/dominios.php";
    $array    = array_map( function( $EL ) {
        return [
            "text"  => $EL,
            "value" => $EL
        ];
    }, $dominios );
    $array[]   = [
        "text"  => 'sistema',
        "value" => ''
    ];
    echo json_encode( $array );