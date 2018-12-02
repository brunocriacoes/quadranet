<?php

    function t( $VAR = null )
    {
        echo "<pre>";
        var_dump( $VAR );
        echo "</pre>";
    }

    function t2( $VAR = null )
    {
        if( isset( $_REQUEST['debug'] ) ):
            echo "<pre>";
            var_dump( $VAR );
            echo "</pre>";
        endif;
    }