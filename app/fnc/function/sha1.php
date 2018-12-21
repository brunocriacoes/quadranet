<?php

    header('Content-type:application/json');
    echo json_encode( [ "sha1" => sha1( request['s'] ?? '' )  ] );
