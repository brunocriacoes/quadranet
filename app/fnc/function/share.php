<?php

    $uri         = urlencode( uri );
    $meta        = get_meta_tags( uri );
    $description = $meta['description'] ?? '';
    $keywords    = $meta['keywords'] ?? '';
   
    echo json_encode( [
        "qr"          => "http://chart.apis.google.com/chart?cht=qr&chl={$uri}&chs=170x170",
        "twitter"     => "http://twitter.com/intent/tweet?text={$description}&url={$uri}",
        "facebook"    => "http://facebook.com/share.php?u={$uri}",
        "google"      => "https://plus.google.com/share?url={$uri}",
        "url"         => uri,
        "description" => $description,
        "keywords"    => $keywords,
    ] );