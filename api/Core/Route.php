<?php

    namespace Core;

    class Route
    {
        function run()
        {
            $file         = $_REQUEST['urls'][0] ?? 'index';
            $file_name    = __DIR__ . "/../Route/{$file}.php";
            $file_default = __DIR__ . "/../Route/index.php";
            $file_name    = file_exists( $file_name ) ? $file_name : $file_default;
            require $file_name;
        }
    }