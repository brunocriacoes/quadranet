class Tabela 
{
    constructor( HEAD, ARR )
    {
        this.HEAD = HEAD;
        this.ARR  = ARR;
    }    
    
    head()
    {
        return this.HEAD.map( x => `<th> ${x.title} </th>`).join('');
    }

    tpl( TPL, OBJ )
    {

    }
    
    btdefault( x, OBJ )
    {
        let achar = this.HEAD.filter( y => y.node == x );
        let tpl   = achar[0].content;
        let keys  = Object.keys( OBJ );
        keys.forEach( x => {
            tpl = tpl.replace( `{{${x}}}`, OBJ[x] );
        } );
        keys.forEach( x => {
            tpl = tpl.replace( `{{${x}}}`, OBJ[x] );
        } );
        return tpl;
    }

    linha( OBJ )
    {
        let nos = this.HEAD.map( x => x.node );
        let td  = nos.map( x => `<td> ${ OBJ[x] || this.btdefault( x, OBJ ) } </td>` ).join('');
        return `<tr>${td}</tr>`;
    }

    body()
    {
        return this.ARR.map( x => this.linha( x ) ).join('');
    }

    html()
    {
        let head = this.head();
        let body = this.body();
        return `
            <table>
                <thead>
                    <tr> ${ head || '' } </tr>
                </thead>
                <tbody>
                    ${ body || '' }
                </tbody>
            </table>
        `;
    }

}