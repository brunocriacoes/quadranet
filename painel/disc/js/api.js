class Api
{
    constructor( API, SITE )
    {
        this.api     = API;
        this.site    = SITE;
        this.token   = localStorage.token || null ;
        this.options = {
            headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
            credentials: "same-origin",
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            body: null
        };
    }

    send( URL, DATA, HOF )
    {
        let debug = ( bug ) ? '&bug=true' :  '';
        let url = encodeURI( `${DATA}&_token=${this.token}${debug}` );
        this.options.body = url;
        fetch( `${this.api}${URL}`, this.options )
        .then( j => j.json() )
        .then( x => {
            HOF( x ) || '';
        } );
    }

    validToken()
    {
        this.send( 'auth/','', x => {
            if( x.error ) {
                this.token = null;
                localStorage.clear();
            }
        } );
    }

    to( URL )
    {
        window.location.href = `${this.site}${URL}`;
    }

    privado() 
    {
        this.validToken();
        if( this.token == null )
        {
            this.to( '' );
        } 
    }

}