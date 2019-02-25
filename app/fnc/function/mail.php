<?php

    $subject  = request['subject'] ?? dominio;
    $to       = request['to'] ?? false;
    
    $msg     = '';    
    foreach( request ?? [] as $key => $value ):
        $msg .= "{$key}: {$value} \r\n";
    endforeach;
    $msg      = wordwrap($msg,70);
    

    $headers  = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= 'From: <sistema@'.dominio.'>' . "\r\n";

    if( $to ):
        @$vailid = mail($to,$subject,$msg,$headers);
    endif;

    echo json_encode( [
        "status" => $vailid ?? 0
    ] );