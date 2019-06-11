    const BalancoFiltro  = {
        origem: ["Sistema", "Site", "Sistema"],
        planos: ["Avulso", "Avulso", "Mensal"],
        meses: ["Ano Completo", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
        statusCompra: ["Aguardando Pagamento","Aguardando Pagamento","Pago","Parcial","Cancelado"],
        itens: [],
        itensModificados: [],
        combo: [],
        csv:[ "CONTRATANTE; EMAIL; DATA; MENSAL/AVULSO; PAGO/NAO PAGO; VALOR R$;" ],
        print: [],
        ano: 0,
        statusPagamento: 0,
        site: 0,
        tipoContratacao: 0,
        termo: 0,
        mes: 0,
        resultado: {
            total: 0,
            mensal: 0,
            avulso: 0,
            pago: 0,
            devido: 0,
            ano: this.ano,
            ano: this.mes,
        },
        init() {

            this.csv   = [ "CONTRATANTE; EMAIL; DATA; MENSAL/AVULSO; PAGO/NAO PAGO; VALOR R$;" ],
         
            this.ajustaDados()
            this.combar()
            this.filtro()
            this.csvRender()
            this.printRender()          
        },
        printRender() {
            this.print = this.combo.map( ordem => ( {
                id: ordem.os.id,
                usuario: ordem.usuario.nome,
                site: this.origem[ ordem.os.site ],
                tipoContratacao: this.planos[ ordem.os.tipoContratacao ],
                statusPagamento: this.statusCompra[ ordem.os.statusCompra ],
                // statusPagamento: this.statusCompra[ ordem.os.status_compra ],
                data: ordem.os.data,
                valor: ordem.os.valor.toFixed(2).toString().replace('.',','),
            } ) )
        },
        csvRender() {
            this.combo.forEach( ordem => {
                this.csv.push( ` ${ordem.usuario.nome}; ${ordem.usuario.email}; ${ordem.os.data}; ${ordem.os.tipoContratacao == 1 ? 'Avulso' : 'mensal'}; ${ordem.os.statusCompra == 2 ? 'Pago' : 'Aguardando Pagamento'}; ${ordem.os.valor}; ` )
            } )
            this.csv.push(`${this.ano}; ${this.meses[ this.mes]}`)
            this.csv.push(`Total ${this.resultado.total}`)
            this.csv.push(`Mensalista ${this.resultado.mensal}`)
            this.csv.push(`Avulso ${this.resultado.avulso}`)
            this.csv.push(`Pago ${this.resultado.pago}`)
            this.csv.push(`Devido ${this.resultado.devido}`)
        },
        filtro() {

            if ( this.ano != 0 ) this.combo = this.combo.filter( orden => orden.os.ano == this.ano )

            if ( this.mes != 0 ) this.combo = this.combo.filter( orden => orden.os.mes == this.mes )
            
            if ( this.site != 0 ) this.combo = this.combo.filter( orden => orden.os.site == this.site )
            
            if ( this.tipoContratacao != 0 ) this.combo = this.combo.filter( orden => orden.os.tipoContratacao == this.tipoContratacao )
            
            if ( this.termo.length >  0 ) this.combo = this.combo.filter( orden => Object.values( orden.usuario ).join(' ').toLowerCase().indexOf( this.termo.toLowerCase() ) != -1 )
            
            this.relatorio()

            if ( this.statusPagamento != 0 ) this.combo = this.combo.filter( orden => orden.os.statusCompra == this.statusPagamento )

        },
        relatorio() {

            this.resultado.total = this.combo.reduce( ( acc, el ) => {
                acc = acc + el.os.valor
                return acc
            }, 0 )

            this.resultado.mensal = this.combo
            .filter( orden => orden.os.tipoContratacao == 2 )
            .reduce( ( acc, el ) => {
                acc = acc + el.os.valor
                return acc
            }, 0 )

            this.resultado.avulso = this.combo
            .filter( orden => orden.os.tipoContratacao == 1 )
            .reduce( ( acc, el ) => {
                acc = acc + el.os.valor
                return acc
            }, 0 )

            this.resultado.pago = this.combo
            .filter( orden => orden.os.statusCompra == 2 )
            .reduce( ( acc, el ) => {
                acc = acc + el.os.valor
                return acc
            }, 0 )

            this.resultado.devido = this.combo
            .filter( orden => orden.os.statusCompra != 2 )
            .reduce( ( acc, el ) => {
                acc = acc + el.os.valor
                return acc
            }, 0 )

        },
        ajustaDados() {
            this.itensModificados = this.itens.map( pedido => {
                return {
                    quadra: {
                        id: pedido.id.split('-').reverse()[0],
                        nome: pedido.quadra_nome
                    },
                    usuario: {
                        id: pedido.contratante,
                        nome: pedido.contratante_nome,      
                        email: pedido.contratante_email,      
                        whatsapp: pedido.whatsapp,      
                        telefone: pedido.contratante_telefone,      
                        cpfCnpj: pedido.cpf_cnpj,      
                    },
                    os: {
                        id: pedido.id,
                        diaCobranca: pedido.dia_compra,
                        diaSemana: Number(pedido.id.substr(23,1)),
                        ano: Number(pedido.id.substr(0,4)),
                        mes: Number(pedido.id.substr(5,2)),
                        dia: Number(pedido.id.substr(8,2)),
                        data: `${pedido.dia_compra}/${pedido.id.substr(5,2)}/${pedido.id.substr(0,4)}`,
                        inicioHS: Number(pedido.id.substr(11,5).replace('-','.')),
                        finalHS: Number(pedido.id.substr(17,5).replace('-','.')),
                        statusCompra: Number(pedido.status_compra),
                        tipoContratacao: Number( pedido.tipo_contatacao ),
                        site: Number( pedido.site || '0' ),
                        valor:Number( pedido.preco.replace( ',','.' ) ),
                    }
                }
            } )
        },
        combar() {
            this.itensModificados.forEach( orden => {
                let valida      = this.combo.findIndex( 
                    test => 
                        test.quadra.id == orden.quadra.id 
                        && test.os.diaSemana == orden.os.diaSemana
                        && test.os.mes == orden.os.mes
                        && test.os.inicioHS == orden.os.inicioHS
                        && test.os.finalHS == orden.os.finalHS
                ) == -1 ? true : false
                if( valida ) this.combo.push( orden )
            } )
        },
    }













    // fetch('http://quadranet.con/app/reservas')
    // .then( j => j.json() )
    // .then( reservas => {        
    //     BalancoFiltro.itens             = reservas
    //     BalancoFiltro.ano               = 0
    //     BalancoFiltro.statusPagamento   = 0
    //     BalancoFiltro.site              = 0
    //     BalancoFiltro.tipoContratacao   = 0
    //     BalancoFiltro.termo             = ""
    //     BalancoFiltro.init()
    //     table( BalancoFiltro.print )
    //     log( BalancoFiltro )
    // } )
