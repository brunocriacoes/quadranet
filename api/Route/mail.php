<?php

    $limpar = function( $str = '' )
    {
        $str = urldecode( $str );
        $str = strip_tags( $str );
        $str = trim( $str );
        $str = wordwrap( $str, 70 );
        return $str;
    };

    $from     = $_REQUEST['urls'][1] ?? '';
    $to       = $_REQUEST['urls'][2] ?? '';
    $subject  = $_REQUEST['urls'][3] ?? '';
    $txt      = $_REQUEST['urls'][4] ?? '';

    $subject = $limpar( $subject );
    $txt     = $limpar( $txt );
    $error   = true;

    if(  ! empty( $from ) & ! empty( $to ) & ! empty( $subject ) & ! empty( $txt ) ):
        $headers  = "From: {$from}" . "\r\n";
        $headers  = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    
        $error = mail( $to, $subject, $txt, $headers );
    endif;

    echo json_encode( [
        "error"   => $error,
        "from"    => $from,
        "to"      => $to,
        "subject" => $subject,
        "txt"     => $txt,
    ] );

