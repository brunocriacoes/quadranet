<?php

    $file = __DIR__ . "/../Data/" . dominio . "/visual/visual.json";
    if( file_exists( $file ) ):
        $json = json_decode( file_get_contents( $file ) );
    endif;

    echo json_encode( [
        "name"             => $json->title ?? '',
        "short_name"       => $json->title ?? '',
        "theme_color"      => $json->cor ?? '#05f',
        "background_color" => $json->cor ?? '#05f',
        "display"          => "standalone",
        "scope"            => "/",
        "start_url"        => "/index.html",
        "lang"             => "pt-BR",
        "description"      => "PWA de exemplo.",
        "dir"              => "auto",
        "orientation"      => "any",
        "serviceworker"    => [
            "src"              => "/disc/js/sw.js",
            "scope"            => "/",
            "update_via_cache" => "none"
        ],
        "screenshots" => [
            [
                "src" => "./disc/img/default.jpg",
                "sizes" => "640x480",
                "type" => "image/jpeg"
            ],[
                "src" => "./disc/img/default.jpg",
                "sizes" => "1280x920",
                "type" => "image/jpeg"
            ]
        ],
        "prefer_related_applications" => false,
        "icons" => [
            [
                "src"   => "./disc/img/default.jpg",
                "sizes" => "72x72",
                "type"  => "image/png"
            ],        
            [
                "src"   => "./disc/img/default.jpg",
                "sizes" => "96x96",
                "type"   => "image/png"
            ],        
            [
                "src"   => "./disc/img/default.jpg",
                "sizes" => "128x128",
                "type"  => "image/png"
            ],        
            [
                "src"   => "./disc/img/default.jpg",
                "sizes" => "144x144",
                "type"  => "image/png"
            ],
            [
                "src"   => "./disc/img/default.jpg",
                "sizes" => "152x152",
                "type"  => "image/png"
            ],        
            [
                "src"   => "./disc/img/default.jpg",
                "sizes" => "192x192",
                "type"  => "image/png"
            ],        
            [
                "src"   => "./disc/img/default.jpg",
                "sizes" => "384x384",
                "type"  => "image/png"
            ],
            [
                "src"   => "./disc/img/default.jpg",
                "sizes" => "512x512",
                "type"  => "image/png"
            ]        
        ]
    ] );