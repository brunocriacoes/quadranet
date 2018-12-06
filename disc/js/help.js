const log = console.log;
const query = x => document.querySelector(x);

function parametros() {
    let url = window.location.search.replace('?', '');
    let uri = url.split('&').reduce((acc, x) => {
        let para = x.split('=');
        acc[para[0]] = decodeURI(para[1]);
        return acc;
    }, {});
    return uri;
}

function objToUrl( OBJ ) {
    let url = Object.keys(OBJ).map( x => {
        return `${x}=${OBJ[x]}`;
    } ).join('&');

    return encodeURI( url );
}

function page() {
    let hash = window.location.hash.replace('#', '');
    return hash;
}

function router(pag, HOF) {
    let pagina = page();
    if (pagina == pag) {
        HOF();
    }
}

function alerta( str ) {
    query( '#alerta' ).style.display = 'block';
    query( '#alerta_msg' ).innerHTML = str;
}

function closeAlerta() {
    query( '#alerta' ).style.display = 'none';
}

function hover_photo(EL, ID) {
    document.querySelector(ID).src = EL.src;
}

function to_float(str) {
    str = str.replace('.', '').replace(',', '.');
    return +str;
}
function get_form( ID )
{
    let form = query( ID );
    let obj  = {};
    for( let i = 0; i < form.length; i++ )
    {
        let tmp_name = form[i].id || form[i].name || 'default';
        obj[ tmp_name ] = form[i].value || form[i].innerHTML || '';
    }
    return obj;
}

function get_form_vio( ID )
{
    let form = query( ID );
    let obj  = {};
    for( let i = 0; i < form.length; i++ )
    {
        let tmp_name = form[i].id || form[i].name || 'default';
        tmp_name = tmp_name.replace( 'vio_', '' );
        obj[ tmp_name ] = form[i].value || form[i].innerHTML || '';
    }
    return obj;
}

function disabled_form( ID )
{
    let form = query( ID );
    for( let i = 0; i < form.length; i++ )
    {
        form[i].setAttribute( 'disabled', 'disabled' );
    }
    return null;
}
function abled_form( ID )
{
    let form = query( ID );
    for( let i = 0; i < form.length; i++ )
    {
        form[i].removeAttribute( 'disabled'  );
    }
    return null;
}
function img_default( e ) { e.src = "./disc/img/default.jpg"; }
function restrito() 
{
    let pages = [ "perfil", "trocar-senha", "historico-compras", "meu-time", "finalizar"];
    pages.map( x => { 
        router( x,  y => {
            privado(); 
        } ); 
    } );    
   
}
restrito();
function entrar()
{
    let form = get_form( '#form_entrar' );
    disabled_form( '#form_entrar' );
    login( form.email || '', form.pass || '', x => {
        abled_form( '#form_entrar' );
    } );    
}

function img_default(e) { e.src = "./disc/img/default.jpg"; }

function day() {
    let semana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    let data = new Date();
    let day = semana[data.getDay()];
    return day;
}

function newDay() {
    let semana = ["1", "2", "3", "4", "5", "6", "7"];
    let data = new Date();
    let day = semana[data.getDay()];
    return day;
}

function set_date( now ) {
    let dia = now.value;
    let data = dia.split( '-' ).reverse().join( '/' );
    let semana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
    let newdate = new Date( dia );
    let day = semana[newdate.getDay()];
    let agendaUp = vio.agenda.map( x => ({ ...x,idAgenda: dia + '-' + x.init.replace( ':', '-' ) }) );
    
    vio.agenda_info = { ..._vio.agenda_info, day: day, date: data };
    vio.agenda = [ ...agendaUp ];

    reserva();
}

function date() {
    let data = new Date();
    let dataAtual = data.getDate() + '/' + (data.getMonth() + 1) + '/' + data.getFullYear();
    return dataAtual;
}

function reserva() {
    let para = parametros();
    fetch( `${uri_api}/reservas?_dominio=quadranet.com.br&quadra=${para.id}${trol}` )
    .then(x => x.json())
    .then(y => {
        let indisponivel = y.map( p => p.ID.substr( 0, 16 ) );
        indisponivel.forEach(x => {
            if( query( `.avulso_${x}` ) ) {
                query( `.avulso_${x}`).innerHTML = 'Indisponivel';
                query( `.avulso_${x}`).classList.add("indisponivel");
                query( `.avulso_${x}`).removeAttribute( 'onclick' );
            }
            if( query( `.mensal_${x}` ) ) {
                query( `.mensal_${x}`).innerHTML = 'Indisponivel';
                query( `.mensal_${x}`).classList.add("indisponivel");
                query( `.mensal_${x}`).removeAttribute( 'onclick' );
            }
        });
    });
}

function filtro(select) {
    fetch(url_api)
        .then(x => x.json())
        .then(q => {
            let quadra = q.quadra;
            let conjunto = Object.values(quadra.results);
            if (select.value !== '') {
                conjunto = Object.values(quadra.results).filter(p => p.tag == select.value);
                }
            let quadras = conjunto;
            vio.quadra = quadras;
        });
}

function add_player() {
    vio.time = [{
        name: query('#player_name').value,
        tel: query('#player_tel').value,
        mail: query('#player_mail').value
    }];
}

function send_mail()
{
    let form = get_form( '#send_mail' );
    let url  = `${uri_api}/mail/contato@quadranet.com.br/${form.email}/${form.assunto}/${form.mensagem} telefone: ${form.telefone}`;
    url      = encodeURI( url );
    disabled_form( '#send_mail' );
    fetch( url )
    .then( j => j.json() )
    .then( x => {
        abled_form( '#send_mail' );
        query( '#alert_send_mail' ).style.display = 'block';
        query( '#send_mail' ).reset();
    } );
}

function recuperarSenha() {
    let form = get_form( '#formulario_recuperar-senha' );
    disabled_form( '#formulario_recuperar-senha' );
    let url = `${uri_api}/profile/?recovery-pass=${form.email || '17'}${trol}`;
    fetch( url )
    .then( j => j.json() )
    .then( x => {
        abled_form( '#formulario_recuperar-senha' );
        query( '#formulario_recuperar-senha' ).reset;
        alerta( 'Nova Senha Enviada' );
    } );
}

function meCadastrar() {
    let form = get_form( '#formulario_me-cadastrar' );
    let uri = objToUrl( form );
    disabled_form( '#formulario_me-cadastrar' );
    let url = `${uri_api}/profile/?cadastrar=true&${uri}${trol}`;
    fetch( url )
    .then( j => j.json() )
    .then( x => {
        abled_form( '#formulario_me-cadastrar' );
        query( '#formulario_me-cadastrar' ).reset;
        window.location.href = '#entrar';
        alerta( 'Cadastrado Com Sucesso' );
    } );
}

function  atualizarPerfil() {
    let form = get_form_vio( '#atualizar_perfil' );
    let uri = objToUrl( form );
    let url = `${uri_api}/profile/?atualizar=${form.email}&${uri}${trol}`;
    fetch( url )
    .then( j => j.json() )
    .then( x => {

    });
}

function mudarSenha() {
    let form = get_form( '#mudar_senha' );
    let url = `${uri_api}/profile/?alter-pass=${_profile.email}&pass=${form.pass}${trol}`;
    fetch( url )
    .then( j => j.json() )
    .then( x => {
        alerta( 'Senha Alterada com Sucesso' );
    } );
}

function addJogador() {
    let form = get_form( '#add-jogador' );
    let url  = `${uri_api}/profile/?add-player=${_profile.email}&name=${form.player_name}&tel=${form.player_tel}&mail=${form.player_mail}${trol}`;
    fetch( url )
    .then( j => j.json() )
    .then( x => {
        alerta( 'Jogador adicionado com sucesso!' );
    } );
}

function join_payment( emailCapitao, idJogador ) {
    let url  = `${uri_api}/profile/?player-buy=${emailCapitao}&usuario=${idJogador}${trol}`;
    fetch( url )
    .then( j => j.json() )
    .then( x => {
    } );
}

async function buy()
{
    let id   = new Date().getTime();
    let cart = {
        usuario  : _profile.id       || '',
        title    : _profile.name     || '',
        email    : _profile.email    || '',
        whatsapp : _profile.whatsapp || '',
        cart     : _vio.cart         || [],
        status   : 1,
        payment  : 1
    };
    cart = JSON.stringify( cart );
    cart = encodeURI( cart );
    _vio.cart.forEach( x => {
        let obj = {
            _dominio: dominio,
            _method: 'POST',
            ID: x.idAgenda,
            usuario: _profile.id,
            quadra: x.id,
            tipocontratacao: x.status,
            final: x.init,
            _token: null,
        };
        let uri = objToUrl( obj );
        let path = `${uri_api}/reserva/?${uri}${trol}`;
        fetch( path )
        .then( x => x.json() )
        .then( x => {

        } );
    } );
    let path = `${uri_api}/buy/?register=${id}&cart=${cart}${trol}`;
    fetch( path )
    .then( x => x.json() )
    .then( x => {

    } );
}

function removePlayer( emailCapitao, idJogador ) {
    query( `#vio_player_${idJogador}` ).style.display = 'none';
    let url  = `${uri_api}/profile?player-del=${emailCapitao}&jogador=${idJogador}${trol}`;
    fetch( url )
    .then( j => j.json() )
    .then( x => {
    } );
} 