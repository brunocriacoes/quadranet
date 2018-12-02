<?php

    $auth = new Core\Auth( $_REQUEST );
    $auth->privado();

    $crud = new Core\Crud( $_REQUEST );
    $crud->rum();