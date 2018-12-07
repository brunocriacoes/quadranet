<?php

    $dominio = $_REQUEST['_dominio'] ?? '';
    $dominio = empty( $dominio ) ? '' : "{$dominio}/";
    $quadra  =  $_REQUEST['quadra'] ?? '';

    $file    = __DIR__ . "/../Data/{$dominio}reserva/index.json";
    if( file_exists( $file ) ):
        $json = (array) json_decode( file_get_contents( $file ) );
    endif;

    $json     = $json ?? [];
    $filter   = array_filter( $json, function( $EL ) { return $EL; } );

    function getUsuarios( $ID )
    {
        $dominio  = $_REQUEST['_dominio'] ?? '';
        $dominio  = empty( $dominio ) ? '' : "{$dominio}/";
        $quadra   =  $_REQUEST['quadra'] ?? '';
        $file     = __DIR__ . "/../Data/{$dominio}usuario/{$ID}.json";
        $dir_buy  = __DIR__ . "/../Data/{$dominio}buy/";
        if( file_exists( $dir_buy ) ):
            $list_buy = glob( "{$dir_buy}*.json*" );
            $json_buy = array_map( function( $name ) { 
                return json_decode( file_get_contents( $name ) );
            }, $list_buy );
            $json_buy = array_filter( $json_buy, function( $item ) use ( $ID ) { return sha1( $item->email ?? '' ) === $ID; } );
            $history = array_values( $json_buy );
        endif;
        if ( file_exists( $file ) ):
            $json       = json_decode( file_get_contents( $file ) );
            @$json->tean = (array) $json->tean ?? [];
            @$json->tean = array_values( $json->tean );
            return [
                "title"    =>  $json->title ?? 'usuário',
                "tel"      =>  $json->zap ?? '(00) 0 0000-0000',
                "email"    =>  $json->email ?? 'usuario@gmail.com',
                "team"     =>  $json->tean ?? [ [ "name" => "usuário", "tel" => "(00) 0 0000-0000", "email" => "usuario@gmail.com" ], [ "name" => "usuário", "tel" => "(00) 0 0000-0000", "email" => "usuario@gmail.com" ], [ "name" => "usuário", "tel" => "(00) 0 0000-0000", "email" => "usuario@gmail.com" ] ],
                "history"  =>  $history ?? [],
                "numberTeam" => @count( $json->tean ?? [] )
            ];
        endif;
        return [];
    }

    $result   = array_reduce( array_keys( $filter ), function( $ACC, $ID ) use ( $dominio, $quadra ) {
        $file = __DIR__ . "/../Data/{$dominio}reserva/$ID.json";
        if( file_exists( $file ) ):
            $json     = json_decode( file_get_contents( $file ) );
            $field    = $json->quadra ?? '';
            $isquadra = $quadra == $field;
            if ( $isquadra ):
                $ACC[] = [
                    "ID"          => $json->ID ?? 'undefined',
                    "usuario"     => $json->usuario ?? 'undefined',
                    "tipo"        => $json->tipocontratacao ?? '1',
                    "usuarioData" => getUsuarios( $json->usuario ?? 'undefined' )
                ];
                return $ACC;
            endif;
        endif;
    }, []  );

    $result = $result ?? [];

    echo json_encode( $result );

