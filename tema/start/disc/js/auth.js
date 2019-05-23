if (localStorage.token === undefined) {
    localStorage.setItem('token', '');
}
if (localStorage.profile === undefined) {
    localStorage.setItem('profile', '{}');
}
var _profile = {};
function privado() {
    let url = `auth2/?token=${window.sessionStorage.token_site || 1}`;
    get_api(encodeURI(url), x => {
        if (!x.token) {
            window.sessionStorage.removeItem('token_site');
            to(`${base}/entrar`);
        }
    });
}
function login(MAIL, PASS, HOF) {
    fetch(`${app}/auth2?login=1&pass=${PASS}&email=${MAIL}${trol}`)
        .then(j => j.json())
        .then(x => {
            HOF(x);
            if (x.error) {
                sessionStorage.token_site = "";
                localStorage.profile = "";
                _profile = {};
                msgAlerta('Senha ou E-mail Errados!');
            } else {
                sessionStorage.token_site = x.token;
                if (sessionStorage.cart.length > 10) {
                    window.location.href = `${base}/finalizar`;
                } else {
                    window.location.href = `${base}/perfil`;
                }
            }
        });
}
function logout() {
    fetch(`${app}/auth2?logout=${sessionStorage.token_site}`)
        .then(j => j.json())
        .then(x => {
            sessionStorage.token_site = "";
            localStorage.profile = "";
            _profile = {};
        });
}

function profile() {
    fetch(`${app}/auth2?profile=${sessionStorage.token_site}`)
        .then(j => j.json())
        .then(x => {
            preencher('atualizar_perfil', x);
        });
}
