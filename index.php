<?php

    header('Access-Control-Allow-Origin: *');
    header('Content-Type: text/html; charset=utf-8');
    date_default_timezone_set('America/Sao_Paulo');
    
    include __DIR__ . '/app/core/hook.php';
    include __DIR__ . '/app/core/help.php';
    include __DIR__ . '/funcoes.php';

    define( 'tema', dominio_valid() );
    
    $data    = json_decode( file_get_contents( uri.'/app' ) );

    $anuncio = $data->anuncio ?? [];
    $anuncio = $anuncio[0];

    $sertvico = $data->pagina ?? [];
    $sertvico = jsFind( $sertvico, function($x) { return $x->id == 'servico' ; } );

    $modalidade = $data->modalidade ?? [];

    $site = $data->site ?? [];
    $site = jsFind( $site, function($x) { return $x->id == 'info' ; } );
    $site->map = str_replace('\\','', $site->map ?? '' );

    $sobre = $data->pagina ?? [];
    $sobre = jsFind( $sobre, function($x) { return $x->id == 'sobre' ; } );

    $blog = $data->blog ?? [];
    $blog = array_map( function($x) {
        $x->resumo = substr( trim( strip_tags( $x->html ?? '' ) ), 0, 75 ) . "..."; 
        return $x;
    }, $blog );

    $quadra = $data->quadra ?? [];
    $quadra = array_map( function($x) {
        $x->resumo = substr( trim( strip_tags( $x->html ?? '' ) ), 0, 75 ) . "..."; 
        return $x;
    }, $quadra );

    if( !empty( urls[1] ) ) {
        $single_blog = jsFind( $blog, function( $x ) { return $x->id == urls[1];  } );
    }

    $html    = '';
    $header  = get_part( 'header' );
    $footer  = get_part( 'footer' );

    if( empty( urls[0] ) ) {
        $html  = get_part( 'index' );
        $html  = $header . $html . $footer;

    } else {
        $html  = get_part( urls[0] );
        $html  = $header . $html . $footer;       
    }

    if( !empty( urls[1] ) ) {
        $single  =  jsFind( $quadra, function( $x ) { return $x->id == urls[1]; } );
    }

    $pasta = uri . "/tema/".tema."/";
   
    $componente = [
        [ "is_array" => true,  "flag" => "banner",  "data" => $data->banner ?? [],  "tpl" => "banner"  ],
        [ "is_array" => false,  "flag" => "servico",  "data" => $sertvico ?? [],  "tpl" => "servico"  ],
        [ "is_array" => false,  "flag" => "menu",  "data" => [],  "tpl" => "menu"  ],
        [ "is_array" => false,  "flag" => "sobre",  "data" => $sobre ?? [],  "tpl" => "sobre"  ],
        [ "is_array" => false,  "flag" => "single",  "data" => $single ?? [],  "tpl" => "single"  ],
        [ "is_array" => false,  "flag" => "agenda",  "data" => $single ?? [],  "tpl" => "agenda"  ],
        [ "is_array" => true,  "flag" => "blog",  "data" => $blog,  "tpl" => "blog"  ],
        [ "is_array" => true,  "flag" => "quadra",  "data" => $quadra,  "tpl" => "quadra"  ],
        [ "is_array" => true,  "flag" => "categorias",  "data" => $modalidade,  "tpl" => "categoria"  ],
        [ "is_array" => true,  "flag" => "modalidade",  "data" => $modalidade,  "tpl" => "modalidade"  ],
        [ "is_array" => false,  "flag" => "menu_lateral",  "data" => [],  "tpl" => "menu_lateral"  ],
        [ "is_array" => false,  "flag" => "single_blog",  "data" => $single_blog ?? [],  "tpl" => "single_blog"  ],
        [ "is_array" => false,  "flag" => "coment_facebook",  "data" => [],  "tpl" => "coment_facebook"  ],
        [ "is_array" => false,  "flag" => "share",  "data" => [],  "tpl" => "share"  ],
    ];

    foreach( $componente as $e ) {
        if( $e["is_array"] ) {
            $html  = str_replace( '{{'.$e["flag"].'}}', print_content( $e["data"], $e["tpl"] ), $html );
        } else {
            $html  = str_replace( '{{'.$e["flag"].'}}', single_print_content( $e["data"], $e["tpl"] ), $html );
        }
    }
    
    $html  = str_replace( '{{banner_link}}', $anuncio->link ?? '', $html );
    $html  = str_replace( '{{banner_foto}}', $anuncio->foto ?? '', $html );
    $html  = str_replace( '{{uri}}', uri, $html );
    $html  = preg_replace( '/link .*href="(?!h)/', "link rel=\"stylesheet\" href=\"{$pasta}", $html );
    $html  = preg_replace( '/src="(?!h)/', "src=\"{$pasta}", $html );
    $html  = single_print_content( $site, '', $html );
    // $html = preg_replace( '/\{\{.*\}\}/', '', $html );

    echo $html;