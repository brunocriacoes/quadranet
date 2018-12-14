    var FILES   = [];
    var POS     = [];
    var OPTIONS = {
        headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
        credentials: "same-origin",
        method: 'POST',
        mode: 'cors',
        cache: 'default',
        body: null
    };
    const help  = x => document.querySelector( '#help' ).innerHTML = x;
    const query =  x => document.querySelector( x );
    const log   = console.log;
    const api   = new Api( uri_api, uri_admin );
    api.privado();

    var pikachu;

    api.send( 'fixos/user', '', x => { 
        let inter = new Interface(x);
        let config = query('#menu-user');           
        let more   = query('#more-menu div');
        let html = inter.tpl((ACC, EL)=>{
            return ACC + 
            `<a href="dash.html${EL.url}" title="${EL.nome}">
                <img src="./disc/ico/${EL.ico}.png" >
                <span>
                    ${EL.nome}
                </span>      
            </a>`;
        });
        config.innerHTML = html;
        more.innerHTML  += html;
    });

    api.send( 'fixos/config', '', x => {
        let filtro = x.filter( x => x.box == 2 );
        let inter = new Interface(filtro);
        let config = query('#menu-config');
        let more   = query('#more-menu div');
        let html = inter.tpl((ACC, EL)=>{
            return ACC + 
            `<a href="dash.html${EL.url}" title="${EL.nome}">
                <img src="./disc/ico/${EL.ico}.png" >
                <span>
                    ${EL.nome}
                </span>      
            </a>`;
        });
        config.innerHTML =  html;
        more.innerHTML  +=  html;
        more.innerHTML  +=  html;
    });

    api.send( 'fixos/config', '', x => {
        let filtro = x.filter( x => x.box == 1 );
        let inter = new Interface(filtro);
        let config = query('#menu-web');
        let more   = query('#more-menu div');
        let html = inter.tpl((ACC, EL)=>{
            return ACC + 
            `<a href="dash.html${EL.url}" title="${EL.nome}">
                <img src="./disc/ico/${EL.ico}.png" >
                <span>
                    ${EL.nome}
                </span>      
            </a>`;
        });
        config.innerHTML =  html;
        more.innerHTML  +=  html;
        more.innerHTML  +=  html;
        setTimeout( x => {
            if( localStorage.dominio != ''  ) {
                query('[title*="cliente"]').innerHTML = '';
                query('[title*="dominio"]').innerHTML = '';
            }
        }, 1000 );
    });
   
    const router = new Router();
    const palco  = document.querySelector( '#content-router' );
    const rum = () => {
        let page = router.page();
        if( page == 'sair' ) {
            window.location.href = "index.html";        
            localStorage.clear();
        }
        api.send( `pages/${page}`, `_dominio=${localStorage.dominio}`, x => {
            document.querySelector( 'title' ).innerHTML = x.title || 'ADMIN';
            palco.innerHTML = '';
            pikachu = x.to || '';
            switch ( x.type ) 
            {
                case 'table':
                    let tb = new Tabela( x.head, x.table );
                    
                    palco.innerHTML += `<header>
                            <h1> ${x.title} </h1>
                            <a href="./dash.html${x.btn}" class="new-element"> + </a>   
                        <header>`;
                    palco.innerHTML += tb.html();
                break;
                case 'form':
                    let fo = new Formulario( x.form );
                    let parametros = router.params();
                    palco.innerHTML += `<header>
                            <h1> ${x.title} </h1>
                        <header>`;
                    palco.innerHTML += fo.html();
                    if( parametros.ID != undefined ) {                        
                        api.send( `${page.split( '-' )[0]}`, `ID=${parametros.ID}&_dominio=${localStorage.dominio}&_filds=${parametros._filds}`, x => {
                            fo.edit( x );
                            query( '#ID' ).value = parametros.ID;
                        } );
                    }
                break;
                case 'page':
                    palco.innerHTML += `<header>
                            <h1> ${x.title} </h1>
                        <header>`;
                    palco.innerHTML += x.html;
                    printAgenda();                    
                break;
               
                default:
                    printHome();
                break;
            }
        } );
    };
    rum();
    router.rum( rum );

    async function sendApi( x ) {
        let rota = new Router();
        let page = rota.page().split( '-' )[0];
        
        let metodo = 'POST';
        let parametros = router.params();
        let apifoto = `${uri_api}uploads/?_dominio=${localStorage.dominio}`;
        if ( FILES.length > 0 ) {
            OPTIONS.body = encodeURI( `file=${FILES[0].data}` );
            var foto = await fetch( `${apifoto}`, OPTIONS )
            .then( y => y.json() )
            .then( z => {
                POS.push( {
                    id: 'foto',
                    nome: z.nome
                } );
            } );
        }
        if ( FILES.length > 1 ) {
            OPTIONS.body = encodeURI( `file=${FILES[1].data}` );
            var foto1 = await fetch( `${apifoto}`, OPTIONS )
            .then( y => y.json() )
            .then( z => {
                POS.push( {
                    id: 'foto1',
                    nome: z.nome
                } );
            } );
        }
        if ( FILES.length > 2 ) {
            OPTIONS.body = encodeURI( `file=${FILES[2].data}` );
            var foto2 = await fetch( `${apifoto}`, OPTIONS )
            .then( y => y.json() )
            .then( z => {
                POS.push( {
                    id: 'foto2',
                    nome: z.nome
                } );
            } );
        }
        if ( FILES.length > 3 ) {
            OPTIONS.body = encodeURI( `file=${FILES[3].data}` );
            var foto3 = await fetch( `${apifoto}`, OPTIONS )
            .then( y => y.json() )
            .then( z => {
                POS.push( {
                    id: 'foto3',
                    nome: z.nome
                } );
            } );
        }
        if ( FILES.length > 4 ) {
            OPTIONS.body = encodeURI( `file=${FILES[4].data}` );
            var foto4 = await fetch( `${apifoto}`, OPTIONS )
            .then( y => y.json() )
            .then( z => {
                POS.push( {
                    id: 'foto4',
                    nome: z.nome
                } );
            } );
        }
        var nomefotos = POS.map( no => `${no.id}=${no.nome}` ).join( '&' );
        if( parametros.ID != undefined ) {
           metodo = 'PUT';
        }
        api.send( page, `${ x }&_method=${metodo}&_dominio=${localStorage.dominio || ''}&${nomefotos}` , z => {
            FILES = [];
            POS = [];
            if (  pikachu == '' ) {
                window.location.href = '';
            }else {
                window.location.href = pikachu;
            }
            document.querySelector( '#help' ).innerHTML = 'Operação realizada com sucesso!';
        } );
    }
    
    function drawPop( title, content ) {
        let titulo = query( '#popup section header h6' );
        let conteudo = query( '#popup section span' );
        titulo.innerHTML = title;
        conteudo.innerHTML = content;
    }

    function trocaDominio(  ) {
        api.send( 'dominios', '', x => { 
            let option = x.map( EL => `<option value="${EL.value}">${EL.text}</option>` ).join( '' );
            drawPop( 'Escolha seu Dominio', 
            `<form class="form" method="post" action="javascript:void(0)" onsubmit="atualizaDominio()">
                <select onchange="setDominio( this.value )">
                    <option value="">selecione um domínio</option>
                    ${option}
                </select>
                <input type="submit" value="Trocar Cliente">
            </form>` );       
         } );
    }

    function atualizaDominio() {
        window.location.href = '';
    }

    function setDominio( x ) {
        localStorage.dominio = x;
    }

    function deletar( ID ) {
        let rota = new Router();
        let page = rota.page().split( '-' )[0];
        let parametros = router.params();
        api.send( page, `_method=DELETE&_dominio=${localStorage.dominio}&ID=${ID}` , x => {
            window.location.href = window.location.href;
        } );
    }

    

    if( localStorage.dominio != '' ) {
        query('#nome-dominio').innerHTML = localStorage.dominio;
    } else {
        query('#nome-dominio').innerHTML = 'SISTEMA';
    }

    function onAgenda( ID, title, cate )
    {
        window.location.href = `dash.html#agenda?ID=${ID}&title=${title}&cate=${cate}`;
    }    

    function selecDate() {
        drawPop( 'Selecione uma data', `
        <form method="post" class="form" onsubmit="gravardata()">
            <input id="today" type="date" required>
            <input type="submit" value="Selecione uma data">
        </form>
        ` );
    }
    
    function gravardata() {
        localStorage.data = query( '#today' ).value;   
    }

    function drawQuadra() {
        api.send( 'tag', `_dominio=${localStorage.dominio}&_filds=title,color,ID`, y => {
           
            var tipo = y.reduce( (a,x) => {
                a[x.ID] = {
                    text: x.title,
                    color: x.color,
                    ID: x.ID
                };
                return a;
            }, {} );
            api.send( 'quadra', `_method=GET&_dominio=${localStorage.dominio}&_filds=title,tag,color`, x => {
                let body = '';
                x.forEach( y => {
                    let tag = tipo[y.tag] || {
                        text: "default",
                        color: "#0055ff",
                        ID: 301
                    };
                    body += `
                    <div class="quadra" onclick="onAgenda( '${y.ID}','${y.title}','${tag.text || 'Removida'}' )">
                    <svg class="quadrasvg" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;margin: 20px;" xml:space="preserve">
                        <g>
                            <g>
                                <path fill="${tag.color || '#0055ff'}" d="M482,91.03H30c-16.542,0-30,13.458-30,30v269.94c0,16.542,13.458,30,30,30h452c16.542,0,30-13.458,30-30V121.03
                                    C512,104.488,498.542,91.03,482,91.03z M482.013,308.958h-45.191V203.042h45.184L482.013,308.958z M271,218.896
                                    c14.772,5.926,25.229,20.319,25.229,37.104c0,16.785-10.457,31.179-25.229,37.104V218.896z M30,203.042h45.178v105.916H30V203.042
                                    z M241,293.104c-14.772-5.926-25.229-20.319-25.229-37.104c0-16.785,10.457-31.179,25.229-37.104V293.104z M241,187.624
                                    c-31.539,6.869-55.229,34.91-55.229,68.376s23.69,61.507,55.229,68.376v66.594H30v-52.012h60.178c8.284,0,15-6.716,15-15V188.042
                                    c0-8.284-6.716-15-15-15H30V121.03h211V187.624z M482,390.97H271v-66.594c31.539-6.869,55.229-34.91,55.229-68.376
                                    s-23.69-61.507-55.229-68.376V121.03h211l0.004,52.012h-60.181c-8.284,0-15,6.716-15,15v135.916c0,8.284,6.716,15,15,15h60.193
                                    l0.003,52.011C482.019,390.969,482.013,390.97,482,390.97z"/>
                            </g>
                        </g>
                        </svg>
                        <div class="infoquadra">
                            <span>${y.title}</span>
                            <span>${tag.text || 'Removida'}</span>
                        </div>
                    </div>
                    `;
                } );
                body += `
                <span class="plus" onclick="window.location.href='dash.html#quadra-novo'">
                    Adicionar Quadra
                </span>
                `;
                query( '#aside' ).innerHTML += body;
        
            } );
        } );
    }

    drawQuadra();

    async function printHome() {
        api.send( 'quadra', `_method=GET&_dominio=${localStorage.dominio}&_filds=title`, x => {
            if(x.length) {
                window.location.href=`dash.html#agenda?ID=${x[0].ID}&title=${x[0].title}`;
            } else {
                window.location.href='dash.html#quadra-novo';
            }
        } );
    }
