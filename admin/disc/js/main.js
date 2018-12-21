window.onpopstate = function() {
    search = params();
    page   = window.location.hash.replace('#', '');
}

day = hoje();