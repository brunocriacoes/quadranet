<?php

    $email = urls[2] ?? 'gmail@gmail.com';
    $size  = urls[3] ?? 32;
    $size  = (int) $size;
    $md5   = md5( $email );
    echo json_encode( [
        "email" => $email,
        "photo" => "https://www.gravatar.com/avatar/{$md5}?s={$size}"
    ] );
    