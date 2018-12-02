<?php

    $url       = $_REQUEST['urls'][1] ?? '';
    $name_file = __DIR__ . "/../Json/fixos/{$url}.json";
    $print     = '[]';
    if( file_exists( $name_file ) ):
        $print = file_get_contents( $name_file );
    endif;
    echo $print;