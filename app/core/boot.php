<?php

    header('Access-Control-Allow-Origin: *');
    header('Content-Type: text/html; charset=utf-8');
    date_default_timezone_set('America/Sao_Paulo');

    if( ! isset( $_REQUEST['bug'] ) ):
        header('Content-type:application/json');
    endif;

    require __DIR__ . "/help.php";
    require __DIR__ . "/hook.php";
    require __DIR__ . "/auto.php";
