class Router 
{

    constructor()
    {}
    
    url()
    {
        return window.location.href.split('?')[0];
    }

    dominio()
    {
        return window.location.href.split('//')[1].split('/')[0].replace('www.');
    }

    page()
    {
        return  window.location.href.split('?')[0].split('#')[1];
    }

    params()
    {
        let param = window.location.href.split('?')[1] || '';
        param = param.split('&').filter( x => x !== '' );        
        let toObject = param.reduce( ( ACC, x )=>{
            let part = x.split('=');
            ACC[ part[0] ] = decodeURI( part[1] );
            return ACC;
        }, {} );
        return toObject;
    }

    rum( HOF )
    {
        window.onpopstate = function()
        {
            HOF();
        }
    }

} 