<?php

    header('Content-type:text/css');

    $file = __DIR__ . "/../Data/" . dominio . "/visual/visual.json";
    if( file_exists( $file ) ):
        $json = json_decode( file_get_contents( $file ) );
    endif;

    $json->cor = $json->cor ?? '#05f';
    echo "    
        :root {
            --theme: {$json->cor};
        }
    ";
    
