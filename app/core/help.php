<?php

    function t( $ITEN )
    {
        echo "<pre>";
        var_dump( $ITEN );
        echo "</pre>";
    }

    function maker_dir( $DIR )
    {
        if( ! file_exists( $DIR ) ):
            mkdir( $DIR );
            file_put_contents( "{$DIR}index.php",'' );
        endif;
    }