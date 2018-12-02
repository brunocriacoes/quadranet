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
        $dominio = $_REQUEST['_dominio'] ?? '';
        $dominio = empty( $dominio ) ? '' : "{$dominio}/";
        $quadra  =  $_REQUEST['quadra'] ?? '';
        $file    = __DIR__ . "/../Data/{$dominio}usuario/{$ID}.json";
        if ( file_exists( $file ) ):
            $json = json_decode( file_get_contents( $file ) );
            return [
                "title" =>  $json->title ?? 'usuário',
                "tel"   =>  $json->zap ?? '(00) 0 0000-0000',
                "email" =>  $json->email ?? 'usuario@gmail.com',
                "team"  =>  $json->team ?? [ [ "name" => "usuário", "tel" => "(00) 0 0000-0000", "email" => "usuario@gmail.com" ], [ "name" => "usuário", "tel" => "(00) 0 0000-0000", "email" => "usuario@gmail.com" ], [ "name" => "usuário", "tel" => "(00) 0 0000-0000", "email" => "usuario@gmail.com" ] ],
                "numberTeam" => count( $json->team ?? [] )
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

