<?php

    // $auth = new Core\Auth( $_REQUEST );
    // $auth->privado(); 

    $dominio = $_REQUEST['_dominio'];
    $dominio = empty( $dominio ) ? '' : "{$dominio}/";

    $dir = __DIR__ . "/../Data/{$dominio}uploads/";

    if ( ! file_exists( $dir ) ) mkdir( $dir );

    
    $file = $_POST['file'] ?? '';

  
    $nome  = uniqid() . ".jpg";
    $file  = base64_decode( $file  ); 
    $file  = explode(',', $file  ); 
    $file  = $file[1] ?? $file[0];
    $file  = base64_decode( $file  );    
    file_put_contents ( "{$dir}{$nome}", $file );
    echo json_encode( [
        "nome"         => $nome
    ] );
   
