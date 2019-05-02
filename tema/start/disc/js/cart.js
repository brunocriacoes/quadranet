if (sessionStorage.cart == undefined) {
    sessionStorage.setItem('cart', '[]');
}

function addCart(obj) {
    let items = get_cart();
    log(items);
    items.push(obj);
    log(items);

    vio.cart = items;

    save_cart(items);
    alerta('Item adicionado ao Carrinho');
}

function removeItem(id) {
    let items = sessionStorage.cart;
    items = JSON.parse(items);
    let indice = items.findIndex(x => { return x.id == id });
    if (items[indice] > 1) {
        let remove = items;
        sessionStorage.cart = JSON.stringify(remove);
        vio.cart = remove;
    } else {
        let remove = items.filter(y => {
            if (y.id === id) {
                return false;
            }
            return true;
        });
        sessionStorage.cart = JSON.stringify(remove);
        vio.cart = remove;
    }
}

function get_cart() {
    let cart = window.sessionStorage.cart || '[]';
    return JSON.parse(cart);
}
function save_cart(obj) {
    window.sessionStorage.setItem('cart', JSON.stringify(obj));
}