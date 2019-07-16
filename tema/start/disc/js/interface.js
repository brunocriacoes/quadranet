
var _vio = {
    time: [],
    title: '',
    keywords: '',
    description: '',
    agenda: [],
    historico: [],
    cart: [],
    total: 0,
    itens_count: 0,
    perfil: {},
    servico: "",
    sobre: {},
    banner: [],
};

var vio = {
    set title(val) {
        _vio.title = val;
        document.querySelector('title').innerHTML = val;
        document.querySelector('#vio_title').innerHTML = val;
    },
    get title() { return _vio.title },
    set reservas(val) {
        _vio.reservas = val;
    },
    get reservas() { return _vio.reservas },
    set description(val) {
        _vio.description = val;
        document.querySelector('meta[name="description"]').content = val;
    },
    get description() { return _vio.description },
    set keywords(val) {
        _vio.keywords = val;
        document.querySelector('meta[name="keywords"]').content = val;
    },
    get keywords() { return _vio.keywords },
    set time(arr) {
        _vio.time = arr;
        let loop = arr.map(iten => {
            return `
            <tr class="meu_time_checkbox" id="vio_player_${iten.id}">
                <th>${ iten.nome || '...'}</th>
                <th>${ iten.tel || '...'}</th>
                <th>${ iten.email || '...'}</th>
                <th><label class="select_termos"><input type="checkbox" ${ (iten.presenca == 1) ? 'checked' : ''} onclick="join_payment( '${iten.id}' )"></<label><span>Confirmado</span></th>
                <th><textarea rows="5" onblur="autoSave( 'time', ${iten.id}, this, 'obs' )" placeholder="Digite sua observação...">${iten.obs || ''}</textarea></th>
                <th onclick="trash( 'time', '${iten.id}' )"><img src="${base}/tema/start/disc/ico/delete.png" class="trash"></th>
            </tr>
            `;
        });
        if (query('#vio_time')) {
            query('#vio_time').innerHTML = loop.join('');
        }
    },
    get time() { return _vio.time; },
    set agenda(el) {
        _vio.agenda = el;
        query('#vio_agenda').innerHTML = el.map(x => {
            console.log('x');
            let data = x.idAgenda.substr(0, 10).split('-').reverse().join('/');
            return `
            <div class="hours__schedule" id="${x.idAgenda}">
                <span>${ x.init || '--:--'}hrs às ${x.end || '--:--'}hrs</span>
                <button class="btn hours__schedule_btn hours__schedule_btn_avulso avulso_${x.idAgenda}" onclick="addCart( '${x.ID || ''}', '${x.name || ''}', 0, '${x.avulso || ''}', '${x.init || ''}', '${x.end || ''}', '${data}', '${x.idAgenda}', '${x.foto}', '${x.modal}' )">Reservar Avulso R$ ${x.avulso || '00,00'},00</button>
                <button class="btn hours__schedule_btn hours__schedule_btn_mensal mensal_${x.idAgenda}" onclick="addCart( '${x.ID || ''}', '${x.name || ''}', 1, '${x.mensal || ''}', '${x.init || ''}', '${x.end || ''}', '${data}', '${x.idAgenda}', '${x.foto}', '${x.modal}' )">Reservar Mensal R$ ${x.mensal || '00,00'},00</button>
            </div>
            `;
        }).join('');
    },
    get agenda() { return _vio.agenda; },
    // set historico(el) {
    //     _vio.historico = el;
    //     if (query('#vio_historico')) {
    //         query('#vio_historico').innerHTML = el.map(x => {
    //             let img = `<img onclick="gerarPagamento( '${x.id}' )" src="${base}/tema/start/disc/ico/credit-card.png" title="Pagamento">`;
    //             let imgAvulso = ``;
    //             return `
    //         <tr>
    //             <td>${ x.data || '--/--/----'}</td>
    //             <td>R$ ${ x.preco || '00,00'}</td>
    //             <td>${ (x.tipocontratacao == 0) ? 'Mensal' : 'Avulso'}</td>
    //             <td>${ (x.status) ? 'Aguardando Pagamento' : 'Pago'}</td>
    //             <td>${(x.tipocontratacao == 0 && x.status_compra == 1) ? img : imgAvulso}</td>
    //             <td><a class="btn btn-sucess" href="${base}/historico-jogador?id=${x.id}">Pagamento Jogadores</a></td>
    //         </tr>
    //         `;
    //         }).join('');
    //     }
    // },
    // get historico() { return _vio.historico; },
    set cart(el) {
        _vio.cart = el;
        vio.finalizar = el;
        let soma_total = el.reduce((acc, item) => {
            acc = acc + to_float((item.tipocontratacao == 0) ? item.mensalidade : item.diaria || "0");
            return acc;
        }, 0);
        this.itens_count = el.length;
        this.total = soma_total.toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        if (query('#vio_cart')) {
            query('#vio_cart').innerHTML = el.map(x => {
                let modalidade = vio.modalidade;
                modalidade = modalidade.find(f => f.id == x.modalidade);
                return `
                    <tr>
                        <td><img src="${url_storage}/${x.foto_1}" class="cart__img"></td>
                        <td>${ modalidade.nome || '---'}</td>
                        <td>${ x.nome || '---'}</td>
                        <td>${ x.id.substr(0,10).split('-').reverse().join('/') || '--/--/----'}</td>
                        <td>${ x.inicio || '--:--'} ás ${x.final || '--:--'}</td>
                        <td>${ (x.tipocontratacao == 2) ? 'Mensal' : 'Avulso'}</td>
                        <td>R$${(x.tipocontratacao == 2) ? x.mensalidade : x.diaria}</td>
                        <td onclick="removeItem( '${x.id}' )"><img src="${base}/tema/start/disc/ico/close.png" class="trash trash__cart"></td>
                    </tr>
                `;
            }).join('');
        }
    },
    get cart() { return _vio.cart; },

    set modalidade(el) {
        _vio.modalidade = el;
    },
    get modalidade() { return _vio.modalidade; },

    set total(el) {
        _vio.total = el;
        if (query('#vio_total_carrinho')) {
            query('#vio_total_carrinho').innerHTML = el;
        }
        if (query('#finalizar_total')) {
            query('#finalizar_total').innerHTML = el;
        }
    },
    get total() { return _vio.total; },
    set itens_count(el) {
        _vio.itens_count = el;
        query('#vio_itens_count').innerHTML = el;
    },
    get itens_count() { return _vio.itens_count; },
    set quadra(el) {
        _vio.quadra = el;
    },
    get quadra() { return _vio.quadra; },
    set perfil(el) {
        _vio.perfil = el;
        ["vio_nome", "vio_apelido", "vio_email", "vio_cpf", "vio_cep", "vio_estado", "vio_cidade", "vio_endereco", "vio_whatsapp"].forEach(x => {
            query(`#${x}`).value = el[x.substr(4)] || '';
        });
    },
    get perfil() { return _vio.perfil; },
    set servico(el) {
        _vio.servico = el;
        query("#vio_servico").innerHTML = el;
    },
    get servico() { return _vio.servico; },
    set sobre(el) {
        _vio.sobre = el;
        query('#vio_sobre_title').innerHTML = el.title || '';
        query('#vio_sobre_content').innerHTML = el.content || '';
        query('#galeria-sobre').src = (url_storage + '/' + el.foto_1) || 'https://placeimg.com/500/500/animals';
        query('#vio_sobre_foto_1').src = (url_storage + '/' + el.foto_1) || 'https://placeimg.com/500/500/animals';
        query('#vio_sobre_foto_2').src = (url_storage + '/' + el.foto_2) || 'https://placeimg.com/500/500/arch';
        query('#vio_sobre_foto_3').src = (url_storage + '/' + el.foto_3) || 'https://placeimg.com/500/500/nature';
        query('#vio_sobre_foto_4').src = (url_storage + '/' + el.foto_4) || 'https://placeimg.com/500/500/tech';
        query('#vio_sobre_foto_5').src = (url_storage + '/' + el.foto_5) || 'https://placeimg.com/500/500/people/grayscale';
    },
    get sobre() { return _vio.sobre; },
    set banner(el) {
        _vio.banner = el;
        let plus = null;
        for (let i = 0; i < el.length; i++) {
            plus = i + 1;
            if (query(`#vio_text_${plus}`)) {
                query(`#vio_text_${plus}`).innerHTML = el[i].text || '';
                query(`#vio_link_${plus}`).href = el[i].link || '';
                query(`#vio_carrousel_foto_${plus}`).src = url_storage + '/' + el[i].foto || 'https://placeimg.com/1000/480/nature';
            }
        }
    },
    get banner() { return _vio.banner; },
    set facebook(el) {
        _vio.facebook = el;
        query("#facebook").href = el;
    },
    get facebook() { return _vio.facebook; },
    set twitter(el) {
        _vio.twitter = el;
        query("#twitter").href = el;
    },
    get twitter() { return _vio.twitter; },
    set youtube(el) {
        _vio.youtube = el;
        query("#youtube").href = el;
    },
    get youtube() { return _vio.youtube; },
    set logo(e) {
        _vio.logo = e;
        query('#vio_logo').src = url_storage + '/' + e;
        query('#vio_logo_2').src = url_storage + '/' + e;
    },
    get logo() { return _vio.logo; },
    set agenda_info(e) {
        _vio.agenda_info = e;
        query("#vio_calendar_img").src = url_storage + '/' + e.foto;
        query("#vio_calendar_name").innerHTML = e.name || '---';
        query("#vio_calendar_modal").innerHTML = e.modal || '---';
        query("#vio_calendar_day").innerHTML = e.day || '---';
        query("#vio_calendar_date").innerHTML = e.date || '--/--/---';
    },
    get agenda_info() { return _vio.agenda_info; },
    set contato(e) {
        _vio.contato = e;
        query('#vio_contact_text').innerHTML = e.text;
        query('#vio_contact_email').innerHTML = e.email;
        query('#vio_contact_email').href = `mailto:${e.email}`;
        query('#vio_contact_tel').innerHTML = e.tel;
        query('#vio_contact_tel').href = `tel:${e.tel}`;
        query('#vio_contact_map').innerHTML = e.map;
    },
    get contato() { return _vio.contato; },
    // set detalhe(e) {
    //     log(e);
    //     _vio.detalhe = e;
    //     query("#detalhe__title").innerHTML = e.title || '';
    //     query("#detalhe__info").innerHTML = e.text || '';
    //     query("#galeria-detalhe").src = url_storage + '/' + e.img_1;
    //     query("#galeria_img-1").src = url_storage + '/' + e.img_1;
    //     query("#galeria_img-2").src = url_storage + '/' + e.img_2;
    //     query("#galeria_img-3").src = url_storage + '/' + e.img_3;
    //     query("#galeria_img-4").src = url_storage + '/' + e.img_4;
    //     query("#galeria_img-5").src = url_storage + '/' + e.img_5;
    //     query("#detalhe_btn").href = `?id=${e.ID || 42}#agenda`;
    // },
    // get detalhe() { return _vio.detalhe; },
    set finalizar(el) {
        _vio.finalizar = el;
        let soma_total = el.reduce((acc, iten) => {
            acc = acc + to_float(iten.price || "0");
            return acc;
        }, 0);
        this.itens_count = el.length;
        this.total = soma_total.toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        if (query('#vio_finalizar')) {
            query('#vio_finalizar').innerHTML = el.map(x => {
                return `
                    <tr>
                        <td>${ x.nome || '---'}</td>
                        <td>${ x.id.substr(0,10).split('-').reverse().join('/') || '--/--/----'}</td>
                        <td>${ x.inicio || '--:--'} ás ${x.final || '--:--'}</td>
                        <td>${ (x.tipocontratacao == 0) ? 'Mensal' : 'Avulso'}</td>
                        <td>R$${(x.tipocontratacao == 0) ? x.mensalidade : x.diaria}</td>
                    </tr>
                `;
            }).join('');
        }
    },
    get finalizar() { return _vio.finalizar; },
};
