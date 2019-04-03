if (localStorage.cart == undefined) {
    localStorage.setItem('cart', '[]');
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
    let items = localStorage.cart;
    items = JSON.parse(items);
    let indice = items.findIndex(x => { return x.id == id });
    if (items[indice] > 1) {
        let remove = items;
        localStorage.cart = JSON.stringify(remove);
        vio.cart = remove;
    } else {
        let remove = items.filter(y => {
            if (y.id === id) {
                return false;
            }
            return true;
        });
        localStorage.cart = JSON.stringify(remove);
        vio.cart = remove;
    }
}

function get_cart() {
    let cart = window.localStorage.cart || '[]';
    return JSON.parse(cart);
}
function save_cart(obj) {
    window.localStorage.setItem('cart', JSON.stringify(obj));
}