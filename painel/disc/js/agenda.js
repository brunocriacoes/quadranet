
function printAgenda() {
    var agenda = router.page();
    if (agenda == 'agenda') {
        let rota = new Router();
        let parametros = router.params();
        palco.innerHTML = 
        `
        <header class="talvez">
            <h1>${parametros.title} - <small>${parametros.cate}</small></h1>
            <span> 
                <img src="./disc/ico/time.png" height="16" class="ico"> 
                <b class="ico"> Falta: </b> 
                <b id="timer" class="ico"> 00:00 </b> 
                <b class="ico"> min </b> 
            </span>
            <span>${localStorage.data.split( '-' ).slice( 1 ).reverse().join( '/' )}</span>
        </header>
        <div class="agenda" id="visualagenda">            
            <div class="infoAgenda">
                <div>Horário</div>
                <div class="SE">segunda</div>
                <div class="TE">terça</div>
                <div class="QA">quarta</div>
                <div class="QI">quinta</div>
                <div class="SX">sexta</div>
                <div class="SA">sábado</div>
                <div class="DO">domingo</div>
            </div>           
        </div>
        `;
        api.send( 'agendas/', `ID=${parametros.ID}&_dominio=${localStorage.dominio}`, x => {
            let html = '';
            html = Object.values( x ).map( drawRow ).join( '' );
            html += `<label class="mais" for="pop" onclick="novoHorario()">Adicionar Horário</label>`;
            query( '#visualagenda' ).innerHTML += html;
            mostrarReserva();
        } );
        mes.all_days.map( y => {
            if( y.day == localStorage.data.split( '-' )[2] ){
                query( `.${y.name_short}` ).style.background = '#05f';
                query( `.${y.name_short}` ).style.color = '#fff';
            }        
        } );
    }
}

function novoHorario() {
    let rota = new Router();
    let parametros = router.params();
    api.send( 'pages/horario-novo', '', x => {
        let form = new Formulario( x.form );
        drawPop( 'Novo Horário', form.html() );
        query( '#quadra' ).value=parametros.ID;
    } );
}

const drawRow = y => {
    let id = y.inicio.replace( ':', '-' );
    let str = localStorage.data.substr( 0, 8 );
    let hoje = localStorage.data.substr( 8, 10 );
    let html = '';
    let dias = mes.all_days.reduce( (a,x) => {
        a[x.day] = x.ID;
        return a;
    },{} );
    
    let antes = dias[+hoje] - 1;
    let depois = 0;
    let contratacao = y.tipocontratacao || "1";
    for( let i = 1; i < dias[+hoje]; i++ ) {
        let soma = hoje - antes;
        html += `<label class="livre" id="gato${str}${soma}-${id}-${dias[soma]}" for="pop" onclick="reservar( '${str}${soma}-${id}-${dias[soma]}', '${y.tipocontratacao}', '${y.final}' )">Livre</label>`;
        antes--;
    }
    for( let i = dias[+hoje]; i < 8; i++ ) {
        let soma = +hoje + depois;
        html += `<label class="livre" id="gato${str}${soma}-${id}-${dias[soma]}" for="pop" onclick="reservar( '${str}${soma}-${id}-${dias[soma]}', '${y.tipocontratacao}', '${y.final}' )">Livre</label>`;
        depois++;
    }
    return `
    <div class="horarios-user" id="">
        <div class="hour">
            <span>${id.replace( '-', ':' )} às ${y.final}</span>
        </div>
        ${html}
    </div>
    `;
}
const ano = JSON.parse( localStorage.calendario );
const mes = ano.find( x => x.ID == localStorage.data.split( '-' )[1] );

function reservar( ID, tipo, final ) {
    api.send( 'selects/usuario', `_dominio=${localStorage.dominio}`, x => {
        let option = x.map( EL => `<option value="${EL.id}">${EL.text}</option>` ).join( '' );
        drawPop( 'Cadastre um horário', 
        `<form class="form" method="post" action="javascript:void(0)" onsubmit="gravareserva( '${ID}','${localStorage.dominio}','${tipo}', '${final}' )">
            <label for="usuario">Buscar Capitão:</label>
            <input type="search" id="usuario" name="usuario" list="listauser" onchange="setUser( this.value )">
            <datalist name="listauser" id="listauser" >
                <option value="1">Cadastre um Novo Capitão</option>
                ${option}
            </datalist>

            <label class="" for="title">Nome Capitão</label>
            <input class="" type="text" id="title" name="title">
            <label class="novo-capitao" for="email">E-mail</label>
            <input class="novo-capitao" type="email" id="email" name="email">
            <label class="novo-capitao" for="whatsapp">WhatsApp</label>
            <input class="novo-capitao" type="text" id="whatsapp" name="whatsapp">
            <label class="novo-capitao" for="password">Senha</label>
            <input class="novo-capitao" type="password" id="password" name="password">
            <label for="contratacao">Selecione um Tipo de Contratação:</label>
            <select name="contratacao" id="contratacao">
                <option value="1">Avulso</option>
                <option value="2">Mensal</option>
            </select>       
            <input type="hidden" value="${ID}" id="ID" name="ID">
            <input type="submit" value="Reservar">
        </form>` );
     } );
}

function atualizarpagina() {
    query( "#pop" ).click();
    window.history.go( -1 );
}

function gravareserva( id,dominio,tipo, final ) {
    let rota = new Router();
    let parametros = router.params();
    if( USER != '1' ) {
        api.send( 'reserva', `_dominio=${dominio}&_method=POST&ID=${id}&usuario=${USER}&quadra=${parametros.ID}&tipocontratacao=${tipo}&final={$final || '00:00'}`, x=> {
            atualizarpagina();
        } );       
    }else{
        let title = query( '#title' ).value;
        let email = query( '#email' ).value;
        let whatsapp = query( '#whatsapp' ).value;
        let password = query( '#password' ).value;
        let url = `title=${title}&email=${email}&whatsapp=${whatsapp}&password=${password}`;
        url = encodeURI( url );
        api.send( 'usuario', `_dominio=${dominio}&_method=POST&quadra=${parametros.ID}&${url}`, x=> {
            api.send( 'reserva', `_dominio=${dominio}&_method=POST&ID=${id}&usuario=${x.ID}&quadra=${parametros.ID}&tipocontratacao=${tipo}`, x=> {
                atualizarpagina();
            } );
        } );
    }
}

function setUser( usuario ) {
    USER = usuario;
    if( USER === '1' ) {
        let lista = document.querySelectorAll( '.novo-capitao' );
        for( let i = 0;i<lista.length;i++ ) {
            lista[i].setAttribute( 'class', 'mostrar-capitao' );
        }
    }
    if( USER !== '1' ) {
        let lista = document.querySelectorAll( '.mostrar-capitao' );
        api.send( 'selects/usuario', `_dominio=${localStorage.dominio}`, x => {
            let user = x.find( y => y.id == usuario );
            query( '#title' ).value = user.text || '';
        } );
        for( let y = 0;y<lista.length;y++ ) {
            lista[y].removeAttribute( 'class' );
            lista[y].setAttribute( 'class', 'novo-capitao' );
        }
    }
}

function mostrarReserva() {
    let rota = new Router();
    let parametros = router.params();
    api.send( 'reservas', `_dominio=${localStorage.dominio}&quadra=${parametros.ID}`, x=> {
        x.forEach( EL => {
            let seletor = `#gato${EL.ID}`;
            if( EL.tipo == '2' ){
                seletor = `[id*='${EL.ID.substr( 10 )}']`;
            }
            if( query( seletor ) != null ) {
                let valida = is_aovivo( EL.ID.substr( 11, 5 ).replace('-',':'), '18:00', EL.ID.substr( 0, 10 ) );
                if ( valida ) {
                    ao_vivo = setInterval( x => {
                        timer( EL.ID.substr( 11, 5 ).replace('-',':'), EL.final || '18:00' );
                    }, 600 );
                }
                let tipo = ( EL.tipo == 1 ) ? 'Avulso' : 'Mensal';
                let colorido = ( EL.tipo == 1 ) ? '#f50' :  '#C00';
                let cortar = ( EL.usuarioData.title.slice( '' ).length > 8 ) ? `${EL.usuarioData.title.substr( 0, 8 )}...` : EL.usuarioData.title;
                query( seletor ).innerHTML = `<span>${cortar}</span><small>${tipo}</small>`;
                query( seletor ).style.background = colorido;
                query( seletor ).removeAttribute( 'onclick' );
                query( seletor ).setAttribute( 'onclick', `mostrarDetalhes( ${JSON.stringify(EL.usuarioData)},'${EL.ID}','${EL.usuario}' )` );
            }
        });
    } );
}

function deletareserva( id,usuario ) {
    api.send( 'deletareserva', `_dominio=${localStorage.dominio}&id=${id}&usuario=${usuario}`, x=> {
        window.location.href = window.location.href;
    } );
}

function mostrarDetalhes( OBJ, ID, usuario ) {
    let result = OBJ.team.reduce( (a,x) => {
        a += 
        `
        <span>${x.name  || '---'}</span>
        <span>${x.tel   || '---'}</span>
        <span>${x.email || '---'} ${ ( x.status ) ? 'pago' : 'em aberto' } </span>
        `;
        return a;
    }, '' );

    drawPop( 'Detalhes do jogador', 
    `
    <b>Nome: </b>${OBJ.title}</br>
    <b>Telefone: </b>${OBJ.tel}</br>
    <b>E-mail: </b>${OBJ.email}</br>
    <div class="tabelateam">
        ${result}
    </div>
    <div class="btn-horario">
        <label for="pop" onclick="deletareserva( '${ID}','${usuario}' )">Cancelar a reserva</label>
        <label for="visualizar">Visualizar Histórico</label>
    </div>
    <input type="checkbox" id="visualizar" hidden>
    <div class="conteudohistorico">
        <span>Código</span>
        <span>Status</span>
        <span>Data</span>
        
        <label class="fecharhistorico" for="visualizar">Fechar</label>
    </div>
    ` );
}
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