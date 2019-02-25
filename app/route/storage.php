<?php

    $upload_dir = __DIR__ . "/../data/" . dominio . "/upload/";
    maker_dir( $upload_dir ); 
    
    if( method === 'POST' AND ! empty( request['file'] ) ):
        $file  = request['file'] ?? '';
        $name  = ! empty( request['name'] ) ? request['id'] : uniqid() . ".jpg";  
        $file  = base64_decode( $file  ); 
        $file  = explode(',', $file  ); 
        $file  = $file[1] ?? '';
        $file  = base64_decode( $file );
        file_put_contents ( "{$upload_dir}{$name}", $file );
        echo json_encode( [ "name" => $name ] );
        die;
    endif;

    if( method === 'GET' ):
        header('Content-type: image/png');
        $name_foto = urls[1] ?? 'default';
        $dir_foto  = $upload_dir . $name_foto;
        if( file_exists( $dir_foto ) ):
            echo file_get_contents( $dir_foto );
        else:
            echo file_get_contents( __DIR__ . "/../default.jpg" );
        endif;        
        die;
    endif;
