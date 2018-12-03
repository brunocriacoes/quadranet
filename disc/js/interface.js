
var _vio = {
    time : [],
    title: '',
    keywords: '',
    description: '',
    agenda: [],
    historico: [],
    cart: [],
    total: 0,
    itens_count: 0,
    perfil : {},
    servico: "",
    sobre: {},
    banner: [],
};

var vio  = {
    set title( val )
    {
        _vio.title = val;
        document.querySelector( 'title' ).innerHTML = val;
        document.querySelector( '#vio_title' ).innerHTML = val;
    },
    get title() { return _vio.title },
    set description( val )
    {
        _vio.description = val;
        document.querySelector( 'meta[name="description"]' ).content = val;
    },
    get description() { return _vio.description },
    set keywords( val )
    {
        _vio.keywords = val;
        document.querySelector( 'meta[name="keywords"]' ).content = val;
    },
    get keywords() { return _vio.keywords },
    set time( el )
    {
        _vio.time.push( ...el );
        query( '#vio_time' ).innerHTML = _vio.time.reduce( (acc , iten ) => {
            acc.push( `
            <tr>
                <th><img src="./disc/ico/delete.png" class="trash"></th>
                <th>${ iten.name || '...' }</th>
                <th>${ iten.tel || '...' }</th>
                <th>${ iten.mail || '...' }</th>
                <th><input type="checkbox"></th>
            </tr>
            `);
            return acc;
        }, [] ).join('');
    },
    get time() { return _vio.time; },
    set agenda( el )
    {
        _vio.agenda = el;
        query( '#vio_agenda' ).innerHTML = el.map( x => {
            let data = x.idAgenda.substr( 0, 10 ).split( '-' ).reverse().join( '/' );
            return `
            <div class="hours__schedule gap-bottom" id="${x.idAgenda}">
                <button class="btn hours__schedule_btn hours__schedule_btn_avulso avulso_${x.idAgenda}" onclick="addCart( '${x.ID || ''}', '${x.name || ''}', 0, '${x.avulso || ''}', '${x.init || ''}', '${x.end || ''}', '${data}', '${x.idAgenda}' )">Avulso R$ ${ x.avulso || '00,00' }</button>
                <span>${ x.init || '--:--' } às ${ x.end || '--:--' }</span>
                <button class="btn hours__schedule_btn hours__schedule_btn_mensal mensal_${x.idAgenda}" onclick="addCart( '${x.ID || ''}', '${x.name || ''}', 1, '${x.mensal || ''}', '${x.init || ''}', '${x.end || ''}', '${data}', '${x.idAgenda}' )">Mensal R$ ${ x.mensal || '00,00' }</button>
            </div>
            `;
        } ).join('');
    },
    get agenda() { return _vio.agenda; },
    set historico( el ) {
        _vio.historico = el;
        query( '#vio_historico' ).innerHTML = el.map( x => {
            return `
            <tr>
                <td>${ x.id || '---' }</td>
                <td>${ x.status || '---' }</td>
                <td>${ x.day || '--/--/----' }</td>
                <td>R$ ${ x.price || '00,00' }</td>
            </tr>
            `;
        } ).join('');
    },
    get historico() { return _vio.historico; },
    set cart( el ) {
        _vio.cart = el;
        vio.finalizar = el;
        let soma_total = el.reduce( ( acc, iten ) => {
            acc = acc + to_float( iten.price || "0" );
            return acc;
        }, 0 );
        this.itens_count = el.length;
        this.total = soma_total.toLocaleString( 'pt-BR', { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' } );
        query( '#vio_cart' ).innerHTML = el.map( x => {
            return `
                <tr>
                    <td onclick="removeItem( '${x.idAgenda}' )"><img src="./disc/ico/delete.png" class="trash"></td>
                    <td>${ x.name || '---' }</td>
                    <td>${ x.day || '--/--/----' }</td>
                    <td>${ x.init || '--:--' } ás ${ x.end || '--:--' }</td>
                    <td>${ ( x.status || true ) ? 'por um dia' : 'por mês'  }</td>
                    <td>R$ ${ x.price || '00,00' } </td>
                </tr>
            `;
        } ).join('');
    },
    get cart() { return _vio.cart; },
    set total( el ) {
        _vio.total = el;
        query( '#vio_total' ).innerHTML = el;
        query( '#finalizar_total' ).innerHTML = el;
    },
    get total() { return _vio.total; },
    set itens_count( el ) {
        _vio.itens_count = el;
        query( '#vio_itens_count' ).innerHTML = el;
    },
    get itens_count() { return _vio.itens_count; },
    set quadra( el ) {
        _vio.quadra = el;
        query( '.fields_grid' ).innerHTML = el.map( z => {
            return `
            <div class="fields__card">
                <img src="${ url_storage + '/' + z.foto  }" onerror="img_default( this )">
                <span class="fields__card_name">${z.title || '---'}</span>
                <div class="fields__card_info">
                    <a href="?id=${ z.ID || 42 }#detalhe" class="btn btn_fields__card_details">Detalhes</a>
                    <a href="?id=${ z.ID || 42 }#agenda" class="btn btn_fields__card_hours">Reservar</a>
                </div>
            </div>
            `;
        } ).join( '' );
    },
    get quadra() { return _vio.quadra; },
    set perfil( el ) {
        _vio.perfil = el;
        [ "vio_nome", "vio_apelido", "vio_email", "vio_whatsapp" ].forEach( x => {
            query( `#${x}` ).value = el[ x.substr( 4 ) ] || '';
        } );
    },
    get perfil() { return _vio.perfil; },
    set servico( el ) {
        _vio.servico = el;
        query( "#vio_servico" ).innerHTML = el;
    },
    get servico() { return _vio.servico; },
    set sobre( el ) {
        _vio.sobre = el;
        query( '#vio_sobre_title' ).innerHTML = el.title || '';
        query( '#vio_sobre_content' ).innerHTML = el.content || '';
        query( '#galeria-sobre' ).src    = ( url_storage + '/' + el.foto_1 ) || 'https://placeimg.com/500/500/animals';
        query( '#vio_sobre_foto_1' ).src = ( url_storage + '/' + el.foto_1 ) || 'https://placeimg.com/500/500/animals';
        query( '#vio_sobre_foto_2' ).src = ( url_storage + '/' + el.foto_2 ) || 'https://placeimg.com/500/500/arch';
        query( '#vio_sobre_foto_3' ).src = ( url_storage + '/' + el.foto_3 ) || 'https://placeimg.com/500/500/nature';
        query( '#vio_sobre_foto_4' ).src = ( url_storage + '/' + el.foto_4 ) || 'https://placeimg.com/500/500/tech';
        query( '#vio_sobre_foto_5' ).src = ( url_storage + '/' + el.foto_5 ) || 'https://placeimg.com/500/500/people/grayscale';
    },
    get sobre() { return _vio.sobre; },
    set banner( el ) { 
        _vio.banner = el;
        let plus    = null;
        for( let i = 0; i < el.length; i++) {
            plus = i + 1;
            if( query( `#vio_text_${plus}` ) ) {
                query( `#vio_text_${plus}` ).innerHTML     = el[i].text || '';
                query( `#vio_link_${plus}` ).href          = el[i].link || '';
                query( `#vio_carrousel_foto_${plus}` ).src = url_storage + '/' + el[i].foto || 'https://placeimg.com/1000/480/nature';
            }
        }
    },
    get banner() { return _vio.banner; },
    set facebook( el ) {
        _vio.facebook = el;
        query( "#facebook" ).href = el;
    },
    get facebook() { return _vio.facebook; },
    set twitter( el ) {
        _vio.twitter = el;
        query( "#twitter" ).href = el;
    },
    get twitter() { return _vio.twitter; },
    set youtube( el ) {
        _vio.youtube = el;
        query( "#youtube" ).href = el;
    },
    get youtube() { return _vio.youtube; },
    set logo( e ) {
        _vio.logo = e;
        query( '#vio_logo' ).src = url_storage + '/' + e;
        query( '#vio_logo_2' ).src = url_storage + '/' + e;
    },
    get logo() { return _vio.logo; },
    set agenda_info( e ) {
        _vio.agenda_info = e;
        query( "#vio_calendar_name" ).innerHTML  = e.name || '---';
        query( "#vio_calendar_modal" ).innerHTML = e.modal || '---';
        query( "#vio_calendar_day" ).innerHTML   = e.day || '---';
        query( "#vio_calendar_date" ).innerHTML  = e.date || '--/--/---';
    },
    get agenda_info() { return _vio.agenda_info; },
    set contato( e ) { 
        _vio.contato = e;
        query( '#vio_contact_text' ).innerHTML  = e.text;
        query( '#vio_contact_email' ).innerHTML = e.email;
        query( '#vio_contact_email' ).href      = `mailto:${e.email}`;
        query( '#vio_contact_tel' ).innerHTML   = e.tel;
        query( '#vio_contact_tel' ).href        = `tel:${e.tel}`;
        query( '#vio_contact_map' ).innerHTML   = e.map;
    },
    get contato() { return _vio.contato; },
    set detalhe( e ) {
        _vio.detalhe = e;
        query( "#detalhe__title" ).innerHTML = e.title || '';
        query( "#detalhe__info" ).innerHTML  = e.text || '';
        query( "#galeria-detalhe" ).src      = url_storage + '/' + e.img_1;
        query( "#galeria_img-1" ).src        = url_storage + '/' + e.img_1;
        query( "#galeria_img-2" ).src        = url_storage + '/' + e.img_2;
        query( "#galeria_img-3" ).src        = url_storage + '/' + e.img_3;
        query( "#galeria_img-4" ).src        = url_storage + '/' + e.img_4;
        query( "#galeria_img-5" ).src        = url_storage + '/' + e.img_5;
        query( "#detalhe_btn" ).href         = `?id=${ e.ID || 42 }#agenda`;
    },
    get detalhe() { return _vio.detalhe; },
    set finalizar ( el ) {
        _vio.finalizar = el;
        let soma_total = el.reduce( ( acc, iten ) => {
            acc = acc + to_float( iten.price || "0" );
            return acc;
        }, 0 );
        this.itens_count = el.length;
        this.total = soma_total.toLocaleString( 'pt-BR', { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' } );
        query( '#vio_finalizar' ).innerHTML = el.map( x => {
            return `
                <tr>
                    <td>${ x.name || '---' }</td>
                    <td>${ x.day || '--/--/----' }</td>
                    <td>${ x.init || '--:--' } ás ${ x.end || '--:--' }</td>
                    <td>${ ( x.status || true ) ? 'por um dia' : 'por mês'  }</td>
                    <td>R$ ${ x.price || '00,00' } </td>
                </tr>
            `;
        } ).join('');
    },
    get finalizar() { return _vio.finalizar; },
};
