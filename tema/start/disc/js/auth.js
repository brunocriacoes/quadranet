if( localStorage.token === undefined ) {
    localStorage.setItem( 'token', '' );
}
if( localStorage.profile === undefined ) {
    localStorage.setItem( 'profile', '' );
}
var _profile = {};
function privado()
{
    fetch( `${app}/auth2?token=${ localStorage.token || '' }` )
    .then( j => j.json() )
    .then( x => {
        if( x.error ) {
            window.location.href = "#entrar";
            localStorage.token   = "";
            localStorage.profile = "";
            _profile = {};
        } else {
            profile();
        }
    } );
}
function login( MAIL, PASS, HOF )
{
    fetch( `${app}/auth2?pass=${ PASS }&email=${MAIL}` )
    .then( j => j.json() )
    .then( x => {
        HOF( x );
        if( x.error ) {
            localStorage.token   = "";
            localStorage.profile = "";
            _profile = {};
            window.location.href = "#entrar";
            alerta( 'Senha ou E-mail Incorretos' );
        } else {
            localStorage.token = x.token;
            window.location.href = "#perfil";
        }
    } );
}
function logout() {
    fetch( `${app}/auth2?logout=${ localStorage.token }` )
    .then( j => j.json() )
    .then( x => {
        localStorage.token_painel   = "";
        localStorage.profile = "";
        _profile = {};
    } );
}
function profile()
{
    fetch( `${app}/profile?token=${localStorage.token_painel}${trol}` )
    .then( j => j.json() )
    .then( x => {
        localStorage.profile = JSON.stringify( x );
        localStorage.profile = JSON.stringify( x );
        _profile = x;
        vio.time  = _profile.tean; //[{name tel mail}]
        vio.perfil = {
            nome     : _profile.name || '',
            apelido  : _profile.nickname || '',
            email    : _profile.email || '',
            whatsapp : _profile.whatsapp || '',
        };
    } );
}
