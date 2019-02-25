"use strict";





function toMinutes( time = '00:00' )
{
    time = time.split( ':' );
    time = ( +time[0] * 60 ) + +time[1];
    return time; 
}
function timer( init, end )
{
    init  = toMinutes( init );
    end   = toMinutes( end );
    resta = end - init;
    return resta;
}

var ao_vivo = null;

function timer( init, end )
{
    let inner = ( x, y )  => {
        if( document.querySelector( x ) ) {
            document.querySelector( x ).innerHTML = y;
        }
    };
    let ao_vivo = x => {
        if( document.querySelector( x ) ) {
            document.querySelector( x ).classList.add( 'ao-vivo' );
        }
    };
    let hour     = new Date();
    let now      = [ hour.getHours(), hour.getMinutes() ];
    let init_r   = init.split( ':' );
    let end_r    = end.split( ':' );           
    let id       = `${hour.getFullYear()}-${hour.getMonth() + 1}-${hour.getDate()}-${init.replace( ':', '-' )}-${hour.getDay()}`;
    let resta_h  = +end_r[0] - +now[0] - 1;
    let resta_m  = 60 - +end_r[1] - +now[1];
    resta_m     += ''; 
    resta_m     = ( resta_m.length > 1 ) ? resta_m : `0${resta_m}`; 
    let resta   = '0' + resta_h + ':' + resta_m;
    if( +resta_m >= 0 && resta_h >= 0  ) {
        inner( '#timer', resta );
        ao_vivo( `#gato${id}` );
    } else {
        inner( '#timer', '00:00' );
    }
    return null;
}

function is_aovivo( init, end, data )
{
    let hour      = new Date();
    let today     = `${hour.getFullYear()}-${hour.getMonth() + 1}-${hour.getDate()}`;
    let now       = [ hour.getHours(), hour.getMinutes() ];
    let inicio    = init.split( ':' );
    let final     = end.split( ':' );
    let iniciou   = +now[0] >= +inicio[0] &&  +now[1] >= +inicio[1] ;
    let finalizou = +now[0] >= +final[0] && +now[1] >= +final[1];
    let is_today  = today === data;
    return inicio && !finalizou && is_today ? true : false;
}