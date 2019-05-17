const $ = function( seletor ) {
    this.result   = false
    this.DB       = false
    this.tplHtml  = false
    let busca    = document.querySelectorAll( seletor ) 
    if( busca ) { this.result = Object.values( busca ) }
    return {
        result : this.result,
        DB: this.DB,
        tplHtml: this.tplHtml,
        getTpl: function( seletor ) {
            let busca = document.querySelector( seletor ) 
            if( busca ) { this.tplHtml = busca.innerHTML  }
            return this
        },
        data: function( data ) { 
            this.DB = data 
            return this
        }, 
        draw: function() {
            if( this.result ) {
                this.result.forEach( element => { 
                    let html = this.DB.map( datas => {
                        let tpl_temp = this.tplHtml;
                        let indice   = Object.keys(datas);
                        for( let i = 0; i < indice.length; i++) {
                            tpl_temp = tpl_temp.replace( RegExp(`{{${indice[i]}}}`,'gi'), datas[indice[i]]  );
                        }
                        return tpl_temp;
                    } ).join('');
                    // html = html.replace(/\{\{.*\}\}/gi, '');
                    element.innerHTML = html
                } )
            }
            return this
        },
        hidden: function() {
            if( this.result ) {
                this.result.forEach( element => { element.style = "display :none !important" } )
            }
            return this
        },
        show: function() {
            if( this.result ) {
                this.result.forEach( element => {  element.style = "display: block !important" } )
            }
            return this
        },
        html: function( html ) {
            if( this.result ) {
                this.result.forEach( element => {  element.innerHTML = html } )
            }
            return this
        },
        val() {
            if( this.result.length ) {
                let elemento = this.result[0] || {}
                return elemento.value || elemento.innerHTML || ''
            }
        }
    }
}