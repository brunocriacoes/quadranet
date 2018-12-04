<?php

    echo json_encode( [
        "crip" => sha1( $_REQUEST['txt'] )
    ] );