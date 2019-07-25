const Form = function( seletor ) {
    return {
        flagEdito: 'data-editor',
        flagFoto: 'data-foto',
        seletor,
        data: {
            dados: {},
            files: {},
            campos: [],
        },
        $( seletor ) {
            let elementos = document.querySelectorAll( seletor )
            elementos     = Object.values( elementos )
            if( elementos.length == 1 ) {
                return elementos[0]
            }
            return elementos
        },
        antesAtualizar() {},
        aposAtualizar() {},
        dados( obj ) {
            this.data.dados = obj
            return this
        },
        valor() {
            return { 
                campos: this.data.dados,
                fotos: this.data.files
            }
        },
        campos() {
            let formulario = this.$( `
                ${this.seletor} input, 
                ${this.seletor} textarea, 
                ${this.seletor} select, 
                ${this.seletor} [${this.flagFoto}]
            ` ) || [];
            this.data.campos  = formulario
            return this
        },
        get() {
            this.antesAtualizar()
            this.campos()
            this.data.campos.forEach( element => {
                nome  = element.name || false
                valor = element.checked || element.value || element.innerHTML || false
                if( nome ) this.data.dados[ nome ] = valor
            } )
            this.aposAtualizar()
            return this;
        },
        previa( img ) {
            let arr = document.querySelectorAll( this.seletor )
            arr     = Object.values( arr )
            arr
            .forEach( campo => {
                campo
                .addEventListener( 'change', function() {
                        Form( this.seletor ).previwewImg( this, img )                         
                } )                
            } )
        },
        previwewImg( foto, previa) {
            let input     = foto; 
            let preview   = document.querySelector( previa );
            if ( input.files && input.files[0] )
            {
                let nome                   = input.name || 'foto';
                let reader                 = new FileReader();
                reader.onload              = ( e ) =>  {
                    let img                = e.srcElement.result;
                    this.data.files[nome]  = window.btoa(img)
                    preview.src            = img;
                };
                reader.readAsDataURL( input.files[0] );
            }
        },
        reset() {
            let formulario     = this.$( this.seletor )
            let btnReset       = this.$( `${this.seletor} [type="reset"]` )
            this.data.files    = {}
            this.data.dados    = {}
            if( formulario ) { formulario.reset() }
            if( btnReset )   { formulario.click() }
        },
        limparDados() {
            this.data.dados.pass     = ''
            this.data.dados.password = ''
        },
        preencher() {
            this.antesAtualizar()
            this.campos()
            this.limparDados()
            this.data.campos.forEach( c => {
                let name = c.name || c.alt || false;
                if( name ) {
                    switch ( c.type ) {
                        case 'select-one':
                            let opcao = Object.values( c ).find( x => x.value == this.data.dados[name] )
                            if( opcao ) opcao.selected = true
                        break;
                        case 'textarea':
                            c.innerHTML = this.data.dados[name] || '';
                        break;
                        case 'checkbox':
                        case 'radio':
                            c.checked = this.data.dados[name] || '';
                        break;
                        case 'file':
                        case 'submit':
                        break;
                        case undefined:
                            c.src = this.data.dados[name] || 'https://via.placeholder.com/150'
                        break;
                        default:
                            c.value = this.data.dados[name] || '';
                        break;
                    }
                }
            } )
            this.aposAtualizar()
        },
        setMascara(el, pattern, limit = true ) {         
            let value   = el.value || ''
            let misterX = pattern.replace(/9/g, 'x')
            let max     = pattern.replace( /\D/gi, '' )
            value       = value.replace( /\D/gi, '' )
            if( limit ) {
                el.setAttribute( 'maxlength', misterX.length )
            }
            if( value.length <= max.length && value.length > 0) {
                value.split('').forEach( x => {
                    let index      = misterX.indexOf('x')
                    misterX        = misterX.split('')
                    misterX[index] = x
                    misterX        = misterX.join('')
                } )
                let ultimo         = misterX.split('').reverse().join('').search(/\d/)
                ultimo             = misterX.length - ultimo
                value              = misterX.substr(0,ultimo)
            }
            el.value = value
        },
        mascara( pattern, limit = true ) {
            let arr = document.querySelectorAll( this.seletor )
            arr     = Object.values( arr )
            arr
            .forEach( campo => {
                campo
                .addEventListener( 'input', function() {
                        Form( this.seletor ).setMascara( this, pattern, limit )                         
                } )                
            } )            
        },        
    }
}
