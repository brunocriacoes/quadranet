class Formulario 
{

    constructor( ARR )
    {
        this.fields     = ARR;
        this.editorBtns = [
            "bold",
            "italic",
            "underline",
            "justifyCenter",
            "justifyFull",
            "justifyRight",
            "justifyLeft",
            "insertUnorderedList"
            // "createLink",
            // "insertImage"
        ];
    }

    static formData( ID )
    {
        let form = document.querySelector( ID );
        let data = {};
        for( let i = 0; i < form.length; i++ )
        {
            if( form[i].type == "checkbox" ) {
                if (form[i].checked ) {
                    data[ form[i].id || 'default' ] = form[i].value || '';
                }
            } else {
                if( form[i].id == "html"  ) {
                    let htm = document.querySelector( `#ed-${form[i].id}` ).innerHTML;
                    data[ form[i].id || 'default' ] = htm || form[i].innerHTML || '';
                } else {
                    data[ form[i].id || 'default' ] = form[i].value || '';
                }
            }
        }
        return data;
    }

    static desable()
    {
        let list = Formulario.formData( '#form' );
        let keys = Object.keys( list );
        keys.forEach( x => {
            let el = document.querySelector( `#${x}` );
            el.setAttribute( 'disabled', 'true' );
        } );
    }

    static abilite()
    {
        let list = Formulario.formData( '#form' );
        let keys = Object.keys( list );
        keys.forEach( x => {
            let el = document.querySelector( `#${x}` );
            el.removeAttribute( 'disabled' );
        } );
    }

    static clear()
    {
        let list = Formulario.formData( '#form' );
        let keys = Object.keys( list );
        keys.forEach( x => {
            let el = document.querySelector( `#${x}` );
            el.value = '';
        } );
    }

    static objToURL( OBJ )
    {
        let keys = Object.keys( OBJ );
        let url  = keys.map( x => `${x}=${OBJ[x]}` ).join('&');
        url      = encodeURI( url );
        return url;
    }

    static ER( INJECT, URL )
    {  
        INJECT( URL ); 
    }

    static sendForm( ID, INJECT )
    {
        let data = Formulario.formData( ID );
        let url  = Formulario.objToURL( data );
        Formulario.desable();
        Formulario.ER( INJECT, url );
    }

    edit( OBJ )
    {
        let keys = Object.keys( OBJ );
        keys.forEach( x => {
            if( document.querySelector( `#${x}` ) )
            {
                document.querySelector( `#${x}` ).value = OBJ[x];
            }
            // EL GATO
            if( x == 'foto' )
            {
                let dominio = localStorage.dominio || '';
                document.querySelector( `#preview-${x}` ).src = `${uri_api}Data/${dominio}/uploads/${OBJ[x]}`;
            }
            if( x == 'foto1' )
            {
                let dominio = localStorage.dominio || '';
                document.querySelector( `#preview-${x}` ).src = `${uri_api}Data/${dominio}/uploads/${OBJ[x]}`;
            }
            if( x == 'foto2' )
            {
                let dominio = localStorage.dominio || '';
                document.querySelector( `#preview-${x}` ).src = `${uri_api}Data/${dominio}/uploads/${OBJ[x]}`;
            }
            if( x == 'foto3' )
            {
                let dominio = localStorage.dominio || '';
                document.querySelector( `#preview-${x}` ).src = `${uri_api}Data/${dominio}/uploads/${OBJ[x]}`;
            }
            if( x == 'foto4' )
            {
                let dominio = localStorage.dominio || '';
                document.querySelector( `#preview-${x}` ).src = `${uri_api}Data/${dominio}/uploads/${OBJ[x]}`;
            }
            if( document.querySelector( `#ed-${x}` ) ) {
                document.querySelector( `#ed-${x}` ).innerHTML = OBJ[x] || '';
            }
        } );
    }

    static atualiza( ID )
    {
        let editor =  document.querySelector( `#ed-${ID}` ).innerHTML;
        document.querySelector( `#${ID}` ).innerHTML = editor;
    }

    editor( ELL )
    {
        // https://code.tutsplus.com/tutorials/create-a-wysiwyg-editor-with-the-contenteditable-attribute--cms-25657
        let botoes = this.editorBtns.map( x => 
            `<img  src="disc/ico/${x}.png" alt="${x}" id="ico-${x}"
                onclick="document.execCommand('${x}'); Formulario.atualiza( '${ELL.ID}' ) ">` 
        ).join('');
        return `
            <div class="editor-box" id="editor-box">
                <div class="editor-btns" id="editor-btns"> ${botoes} </div>
                <div 
                    id="ed-${ELL.ID}"
                    contenteditable="true"
                    id="editor-content"
                    onkeyup="Formulario.atualiza( '${ELL.ID}' )"
                ></div>
                <textarea name="${ELL.ID}" id="${ELL.ID}" hidden></textarea>                
            </div>
        `;
    }
    
    foto( ELL )
    {
        return  `
            <label for="${ELL.ID}" class="bt-${ELL.type}">${ELL.label}</label>
            <div class="conjunto-foto">
                <label class="btn btn-upload">
                    <b>${ELL.label || ''}</b>
                    <input type="file" id="get-${ELL.ID}" hidden onchange="Formulario.getFile( '${ELL.ID}' )">
                </label>
                <img src="./disc/img/default.jpg" alt="imagem default" id="preview-${ELL.ID}" onerror=" this.src = './disc/img/default.jpg'" class="preview">
                <span class="del-image" onclick="document.querySelector('#preview-${ELL.ID}').src = './disc/img/default.jpg'"> x </span>
            </div>
        `;
    }

    static getFile( ID )
    {
        let input   = document.querySelector( `#get-${ID}` ); 
        let preview = document.querySelector( `#preview-${ID}` );
        let fileld  = document.querySelector( `#${ID}` );    
        if (input.files && input.files[0])
        {
            let reader   = new FileReader();
            reader.onload = ( e ) =>  {
                let img = e.srcElement.result;
                let imagem64 = window.btoa(img);
                let local    = localStorage.dir;
                FILES.push( {
                    id: ID,
                    data: imagem64
                } );
                preview.src      = img;
            };           
            reader.readAsDataURL(input.files[0]);
        }        
    }

    tpl_form( OBJ )
    {
        let isRequired =  OBJ.required ? 'required="required"' : '';
        let option     = null;
        switch ( OBJ.type ) 
        {        
            case 'editor':
                return this.editor( OBJ );          
            break;
            case 'textarea':
                return `
                    <label for="${OBJ.ID}" class="bt-${OBJ.type}">${OBJ.label}</label>
                    <textarea name="${OBJ.ID}" id="${OBJ.ID}" ${isRequired}> ${OBJ.value || ''} </textarea>
                `;            
            break;
            case 'select':
                let options = null;
                let valid   = typeof OBJ.arr !== 'string';
                if( valid )
                {
                    options = OBJ.arr.map( x => `<option value="${ x.value || '' }">${ x.text || '' }</option>` ).join('');
                }
                return `
                    <label for="${ OBJ.ID || '' }"> ${ OBJ.label || '' } </label>
                    <select name="${ OBJ.ID || '' }" id="${ OBJ.ID || '' }">
                        <option value=""> escolha o(a) ${ OBJ.label || '' }</option>
                        ${ options || '' }
                    </select>
                `;
            break;        
            case 'check-all':
                let options2 = null;
                let valida   = typeof OBJ.arr !== 'string';
                if( valida )
                {
                    options2 = OBJ.arr.map( x => `<label> <input type="checkbox" name="${OBJ.ID || ''}[]" id="${OBJ.ID || '' }[]" value="${ x.value || '' }">${ x.text || '' }</label>` ).join('');
                }
                return `
                    <div class="check-all" id="${OBJ.ID}"> 
                        <label> ${ OBJ.label || '' } </label>
                        ${ options2 || '' }
                    </div>
                `; 
            break;
            case 'file':
                return this.foto( OBJ );
            break;  
            case 'btn':
                return `
                <label for="${ OBJ.ID || '' }"> ${ OBJ.label || '' } </label>
                <a href="${ OBJ.value || '' }" class="btn-visualizar"> VISUALIZAR </a>
                `;
            break;  
            default:
                return `
                    <label for="${ OBJ.ID || '' }">${ OBJ.label || '' }</label>
                    <input type="${ OBJ.type || '' }" autocomplete="off" name="${ OBJ.ID || '' }" id="${ OBJ.ID || '' }" value="${OBJ.value || ''}" ${ isRequired || '' }>
                `;
            break;
        }
    }

    insert( OBJ )
    {
        let query = x => document.querySelector( x );
        Object.keys( OBJ ).forEach( el => {
            query( `#${el}` ).value = decodeURI( OBJ[ el ] );
        } );
    }

    html()
    {
        let result = this.fields.map( el => this.tpl_form( el ) ).join('');
        return `<form method="POST" action="javascript:void( Formulario.sendForm( '#form', sendApi ) )" id="form" class="form" >
                    ${result}
                </form>`;
    }

}