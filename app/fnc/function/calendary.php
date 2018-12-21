<?php
    
    $ANO  = urls[2] ?? date( 'Y' );
    
    $MES  = [
        [ "ID" => 1,  "name" => "Janeiro", "name_short"   => "jan", "days" => 31 ],
        [ "ID" => 2,  "name" => "Fevereiro", "name_short" => "fev", "days" => 28 ],
        [ "ID" => 3,  "name" => "Março", "name_short"     => "mar", "days" => 31 ],
        [ "ID" => 4,  "name" => "Abril", "name_short"     => "abr", "days" => 30 ],
        [ "ID" => 5,  "name" => "Maio", "name_short"      => "mai", "days" => 31 ],
        [ "ID" => 6,  "name" => "Junho", "name_short"     => "jun", "days" => 30 ],
        [ "ID" => 7,  "name" => "Julho", "name_short"     => "jul", "days" => 31 ],
        [ "ID" => 8,  "name" => "Agosto", "name_short"    => "ago", "days" => 31 ],
        [ "ID" => 9,  "name" => "Setembro", "name_short"  => "set", "days" => 30 ],
        [ "ID" => 10, "name" => "Outubro", "name_short"   => "out", "days" => 31 ],
        [ "ID" => 11, "name" => "Novembro", "name_short"  => "nov", "days" => 30 ],
        [ "ID" => 12, "name" => "Dezembro", "name_short"  => "dez", "days" => 31 ]
    ];

    $DIAS = [
        "1" => [ "ID" => 1, "name_short" => "SE", "name" => "Segunda Feira"],
        "2" => [ "ID" => 2, "name_short" => "TE", "name" => "Terça Feira"],
        "3" => [ "ID" => 3, "name_short" => "QA", "name" => "Quarta Feira"],
        "4" => [ "ID" => 4, "name_short" => "QI", "name" => "Quinta Feira"],
        "5" => [ "ID" => 5, "name_short" => "SX", "name" => "Sexta Feira"],
        "6" => [ "ID" => 6, "name_short" => "SA", "name" => "Sábado"],
        "7" => [ "ID" => 7, "name_short" => "DO", "name" => "Domingo" ]
    ];
    
    $dias_mes = function( $DAYS = 1, $MES = 1 ) use ( $ANO, $DIAS )
    {
        $ACC = [];
        for( $i = 01; $i <= $DAYS; $i++ ):
            $ID = date( 'N', strtotime( "{$ANO}-{$MES}-{$i}") );
            
            $ACC[] = [
                "day"        => $i,
                "ID"         => $ID,
                "name"       => $DIAS[$ID]['name'],
                "name_short" => $DIAS[$ID]['name_short']
            ];
        endfor;
        return $ACC;
    };

    $ALL = array_reduce( $MES, function( $ACC, $EL ) use ( $dias_mes, $ANO, $MES, $DIAS ) {
        $EL['all_days'] = $dias_mes( $EL['days'], $EL['ID'] );
        $ACC[]        = $EL;
        return $ACC;
    }, [] );

    echo json_encode( $ALL );