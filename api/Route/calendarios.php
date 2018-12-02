<?php
    
    $ANO  = $_REQUEST['urls'][1] ?? date( 'Y' );
    $MES  = json_decode( file_get_contents( __DIR__ . "/../Json/fixos/meses.json" ) );
    $DIAS = json_decode( file_get_contents( __DIR__ . "/../Json/fixos/dias.json" ) );

    $dias_mes = function( $DAYS = 1, $MES = 1 ) use ( $ANO, $DIAS )
    {
        $ACC = [];
        for( $i = 01; $i <= $DAYS; $i++ ):
            $ID = date( 'N', strtotime( "{$ANO}-{$MES}-{$i}") );
            $ACC[] = [
                "day"        => $i,
                "ID"         => $ID,
                "name"       => $DIAS->{$ID}->name,
                "name_short" => $DIAS->{$ID}->name_short
            ];
        endfor;
        return $ACC;
    };

    $ALL = array_reduce( $MES, function( $ACC, $EL ) use ( $dias_mes, $ANO, $MES, $DIAS ) {
        $EL->all_days = $dias_mes( $EL->days, $EL->ID );
        $ACC[]        = $EL;
        return $ACC;
    }, [] );

    echo json_encode( $ALL );