const Balanco  = {
    itens: [],
    totais: [],
    mensalidades: [],
    avulsos: [],
    devidos: [],
    pagos: [],    
    ano( x ) {
        if( x != "0" ) {
            this.itens = this.itens.filter( el => el.id.indexOf(`${x}-`)  != -1 ? true : false )
        }
    },
    mes( x ) {
        if( x != "0" ) {
            this.itens = this.itens.filter( el => { 
                let data = new Date( el.id.substr(0, 10) )
                return x == data.getMonth() ? true : false
            } )            
        }
    },
    total() { this.totais = this.itens.map( result => result.valor ) },
    mensalidade() {
        let arr           = this.itens.filter( item => item.tipocontratacao != '1' )
        this.mensalidades = this.getVal( arr )
    },
    avulso() {
        let arr      = this.itens.filter( item => item.tipocontratacao == '1' )
        this.avulsos = this.getVal( arr )        
    },
    devido() {
        let arr      = this.itens.filter( item => item.tipo_pagamento != '2' )
        this.devidos = this.getVal( arr )        
    },
    pago() {
        let arr    = this.itens.filter( item => item.tipo_pagamento == '2' )
        this.pagos = this.getVal( arr )
    },
    toFloat( str ) {
        return +str
        .replace( '.', '' )
        .replace( ',', '.' )
    },
    toMoney( str ) {
        return str
        .toLocaleString('pt-BR', { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' } )
    },
    getVal( arr ) {
        return arr.map( result => result.valor )
    },
    somaTotal( arr ) {
        arr = arr.map( valor => this.toFloat( valor ) )
        somaTotal = arr.reduce( ( acc, el ) => { 
            acc = acc + el
            return acc
        }, 0 )
        return this.toMoney( somaTotal )
    },
    render() {
        this.total()
        this.mensalidade()
        this.avulso()
        this.devido()
        this.pago()
    },
    val() {
        this.render()
        return {
            total: this.somaTotal( this.totais ),
            mensalidade: this.somaTotal( this.mensalidades ),
            avulso: this.somaTotal( this.avulsos ),
            devido: this.somaTotal( this.devidos ),
            pago: this.somaTotal( this.pagos ),
        }
    },
}

