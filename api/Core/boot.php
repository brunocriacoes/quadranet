<?php

    header('Access-Control-Allow-Origin: *');
    header('Content-Type: text/html; charset=utf-8');
    
    if( ! isset( $_REQUEST['bug'] ) ):
        header('Content-type:application/json');
    endif;

    date_default_timezone_set('America/Sao_Paulo');

    define( 'OFFSET', 1 );

    $_REQUEST['erros'] = require __DIR__ . "/erros.php";
    require __DIR__ . "/auto.php";
    require __DIR__ . "/hook.php";
    require __DIR__ . "/help.php";

    $route = new Core\Route();
    $route->run();
