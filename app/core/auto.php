<?php

    function _auto_load( $NAME )
    {
        $NAME = str_replace( '\\', '/', $NAME );
        $file = __DIR__ . "/../{$NAME}.php";
        if( file_exists( $file ) ):
            require_once $file;
        endif;
    }

    spl_autoload_register( "_auto_load" );