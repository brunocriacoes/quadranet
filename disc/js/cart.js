if( localStorage.cart == undefined ) {
    localStorage.setItem('cart', '[]');
}

function addCart( ID, name, status, price, init, end, data, idAgenda ) {
    let item = [{
        'id': ID,
        'name': name,
        'status': status,
        'price': price,
        'init': init,
        'end': end,
        'day': data,
        'idAgenda': idAgenda
    }];

    let items = localStorage.cart;
    items = JSON.parse(items);
    let indice = items.findIndex(x => { return x.idAgenda == idAgenda; });
    if (indice == -1) {
        items.push(...item);
    }

    localStorage.cart = JSON.stringify(items);
    vio.cart = items;

    window.location.href = '#carrinho';
    alerta( 'Item adicionado ao Carrinho' );
}

function removeItem( idAgenda ) {
    let items = localStorage.cart;
    items = JSON.parse(items);
    let indice = items.findIndex( x => { return x.idAgenda == idAgenda } );
    if (items[indice] > 1) {
        let remove = items;
        localStorage.cart = JSON.stringify(remove);
        vio.cart = remove;
    } else {
        let remove = items.filter(y => {
            if (y.idAgenda === idAgenda) {
                return false;
            }
            return true;
        });
        localStorage.cart = JSON.stringify(remove);
        vio.cart = remove;
    }
}