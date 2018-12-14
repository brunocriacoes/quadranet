<?php
    
    $buy_dir  = __DIR__ . "/../Data/" . dominio . "/buy/";
    $index    = __DIR__ . "/../Data/" . dominio . "/buy/index.json";
    if( ! file_exists( $buy_dir ) ):
        mkdir( $buy_dir );
    endif;
    if( ! file_exists( $index ) ):
        file_put_contents( $index, '{}' );
    endif;
    $index_json = json_decode( file_get_contents( $index ) );
    if( isset( $_REQUEST['register'] ) AND ! empty( $_REQUEST['cart'] ) ):
        $id                         = $_REQUEST['register'] ?? '';
        $cart                       = urldecode( $_REQUEST['cart'] ?? '{}' );
        $cart                       = str_replace( '\\', '', $cart );
        $cart                       = json_decode($cart);
        $transaction                = $_REQUEST['register'] ?? sha1( uniqid() );
        $cart->data = Date('d/m/y');
        $cart->transacao = $transaction;
        $file_cart                  = __DIR__ . "/../Data/" . dominio . "/buy/{$id}.json";
        $index_json->{$transaction} = true;
        file_put_contents( $index, json_encode( $index_json ) );
        file_put_contents( $file_cart, json_encode( $cart ) ); 
    endif;    
    
    $pag_file = __DIR__ . "/../Data/" . dominio . "/pagseguro/pagseguro.json";
    if( file_exists( $pag_file ) ):
        $pag_json = json_decode( file_get_contents( $pag_file ) );
    endif;

    $email     = $pag_json->email ?? '';
    $token     = $pag_json->token ?? '';
    $pag       =  new \Core\PagSeguro( $email, $token );
    $itens     = [];    
    foreach( $cart->cart as $k => $i ):
        $n = $k + 1;
        $itens[ "itemId{$n}" ]          = $i->idAgenda;
        $itens[ "itemDescription{$n}" ] =  "locacao {$i->name} as {$i->init}" ;
        $itens[ "itemAmount{$n}" ]      = str_replace( ['.',','], ['','.'], $i->price );
        $itens[ "itemQuantity{$n}" ]    = '1';
        $itens[ "itemWeight{$n}" ]      = '1000';
        
    endforeach; 
    $pag->items = $itens;
    $code      = $pag->buy();
    
    $dir_reserva = __DIR__ . "/../Data/" . dominio . "/reserva/";
    $index_reserva = __DIR__ . "/../Data/" . dominio . "/reserva/index.json";
    if( ! file_exists( $dir_reserva ) ) mkdir( $dir_reserva );
    if( file_exists( $index_reserva ) ):
        $json_index_reserva = json_decode( file_get_contents( $index_reserva ) );
    else:
        $json_index_reserva = (object) [];
    endif;
    foreach( $cart->cart as $k => $i ):
        $nome_reserva = "{$dir_reserva}{$i->idAgenda}.json";
        file_put_contents( $nome_reserva, json_encode(
            [
                "ID"              => $i->idAgenda,
                "usuario"         => sha1( $cart->email ),
                "usuario_name"    => $cart->title,
                "quadra"          => $i->id,
                "quadra_name"     => $i->name,
                "tipocontratacao" => $i->status,
                "final"           => $i->end,                
                "criado"          => date( 'Y-m-d' ),
                "criado-print"    => date( 'd/m/Y' ),
                "status"          => 1
            ]
        ) );
       
        $json_index_reserva->{$i->idAgenda} = true;
    endforeach; 
    file_put_contents( $index_reserva, json_encode( $json_index_reserva ) );

    echo json_encode( [
        "error"   => false,
        "mensage" => "carrinho registrado",
        "cart"    => $cart->cart ?? [],
        "code"    => (string) $code['body']->code ?? ''
    ] );
