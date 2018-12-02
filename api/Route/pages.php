<?php

    function selects( $ID = false )
    {      
        $is_fix  = __DIR__ . "/../Json/fixos/{$ID}.json";
        $dominio = empty( $_REQUEST['_dominio'] ) ? '' : "{$_REQUEST['_dominio']}/";
        $is_db   = __DIR__ . "/../Data/{$dominio}{$ID}/index.json";
        if( file_exists( $is_fix ) ):
            return json_decode( file_get_contents( $is_fix ) );
        endif;
        if( file_exists( $is_db ) ):
            $json   = json_decode( file_get_contents( $is_db ) );
            $ativos = array_filter( (array) $json, function( $EL ) { return $EL; } );
            $result = array_map( function( $X ) use ( $dominio, $ID  ) {
                $file   = __DIR__ . "/../Data/{$dominio}{$ID}/{$X}.json";
                if ( file_exists( $file ) ):
                    $J = json_decode( file_get_contents( $file ) );
                    $status = $J->status ?? false;
                    if( $status ) :
                        return [
                            "value" => $X,
                            "text" => $J->title ?? $J->nome ?? $J->name ?? 'não definido'
                        ];
                    endif;
                endif;
            }, array_keys( $ativos ) );
            return $result;
        endif;
        return [];
    }

    function form( $JSON )
    {

        $ARR = $JSON->form ?? [];
        $PRO = array_map( function( $EL ) {
            if(  $EL->type === 'select'  ):
                $EL->arr = selects( $EL->ID );
                return $EL;
            else:
                return $EL;
            endif;
        }, $ARR );
        $JSON->form = $PRO;
        return $JSON;

    }

    function table( $JSON )
    {
        $ID      = $JSON->db;
        $dominio = empty( $_REQUEST['_dominio'] ) ? '' : "{$_REQUEST['_dominio']}/";
        $is_db   = __DIR__ . "/../Data/{$dominio}{$ID}/index.json";
        if( file_exists( $is_db ) ):
            $json   = json_decode( file_get_contents( $is_db ) );
            $ativos = array_filter( (array) $json, function( $EL ) { return $EL; } );
            $result = array_map( function( $X ) use ( $dominio, $ID  ) {
                $file   = __DIR__ . "/../Data/{$dominio}{$ID}/{$X}.json";
                if ( file_exists( $file ) ):
                    $J = json_decode( file_get_contents( $file ) );
                    return $J;
                endif;
            }, array_keys( $ativos ) );
        endif;
        $JSON->table = $result ?? [];
        return $JSON;
    }

    $url       = $_REQUEST['urls'][1] ?? '';
    $name_file = __DIR__ . "/../Json/pages/{$url}.json";

    if( file_exists( $name_file ) ):
        $json = json_decode( file_get_contents( $name_file ) );
        $tipo = $json->type ?? '';
        switch ( $tipo ) {
            case 'form':
                $json = form( $json );
            break;
            case 'table':
                $json = table( $json );
            break;            
        }
        $print = json_encode( $json );
    endif;

    echo $print ?? '[]';
