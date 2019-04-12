<?php

    $mail_dir = __DIR__ . "/../../data/". dominio . "/mails/";
    if( ! file_exists( $mail_dir ) ) {
        mkdir( $mail_dir );
    }

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
        file_put_contents( "{$mail_dir}".request['id'].".json", json_encode( request ) );
        @$vailid = mail($to,$subject,$msg,$headers);
    endif;

    echo json_encode( [
        "status" => $vailid ?? false
    ] );