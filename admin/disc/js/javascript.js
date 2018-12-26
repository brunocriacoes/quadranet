"use strict";
beta.sistema = true;
get( 'dominio', '', x => {
    beta.dominio = x; 
    beta.usuario_novo = { domain: x };
} );

get( 'auth', '', x => {
    beta.usuario = x; 
} );

get( 'error', '', x => {
    beta.registro_problema = x; 
} );
get( 'auth', {profile: localStorage.jwt_token }, x => {
    beta.perfil = x; 
} );

