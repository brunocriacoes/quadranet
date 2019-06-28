<?php

function print_content( $data, $componente ) {
    $data = $data ?? [];
    $path = get_tpl( $componente );
    $loop = array_map( function( $x ) use($path) {
        @$x->uri = uri;
        $keys = array_keys( (array)$x );
        $bombom = array_map( function( $p ) {
            return "{{".$p."}}";
        }, $keys );
        $keys_api = array_values( (array)$x );
        $y = str_replace( $bombom , $keys_api, $path );

        return $y;
    }, (array)$data );
    return  implode( '', $loop ?? [] );
}

function single_print_content( $data, $componente, $html = null ) {
    $data       = $data ?? (object)[];
    @$data->uri = uri;
    if( $html == null ) {
        $path = get_tpl( $componente );     
    } else {
        $path = $html;
    }
    $keys = array_keys( (array)$data );
    $bombom = array_map( function( $p ) {
        return "{{".$p."}}";
    }, $keys );
    $keys_api = array_values( (array)$data );
    @$y = str_replace( $bombom , $keys_api, $path );
    return $y;
}

function jsFind( $arr, $hof ) {
    foreach ($arr as $key => $value) {
        $valid = $hof($value);
        if ( $valid ) {
            return $arr[$key];
        }
    }
}

function get_part( $nome = '' ) {
    $nome_file    = __DIR__ . "/tema/".tema."/{$nome}.html";
    if( file_exists( $nome_file ) ) { 
        return file_get_contents( $nome_file ); 
    }
    return ""; 
}

function get_tpl( $nome = '' ) {
    $nome_file    = __DIR__ . "/tema/".tema."/componente/{$nome}.html";
    if( file_exists( $nome_file ) ) { 
        return file_get_contents( $nome_file ); 
    }
    return ""; 
}

function dominio_valid() {
    $file  = __DIR__ . "/app/data/dominio/" . dominio . ".json";
    if( file_exists( $file ) ) {
        $json = file_get_contents( $file );
        $json = json_decode( $json );
        $status = $json->ativo ?? false;
        if( $status == "1" ) {
            return 'start';
        } else {
            return 'construcao';
        }
    } else {
        return 'construcao';
    }
}

function completaTitulo() {
    $titulo = urls[0] ?? '';
    $titulo = str_replace('-', ' ', $titulo);
    $titulo = ucwords($titulo);
    return $titulo;
}

function getRedes( $arr ) 
{
    $acc = [];
    foreach( $arr as $key => $val ) 
    {
        if( $key == 'facebook' or $key == 'twitter' or $key == 'youtube' or $key == 'instagram'  ) {
            if( !empty( $val ) )
                $acc[] = [ "ico" => $key, "link" => $val ];
        }
    }
   return $acc;
}