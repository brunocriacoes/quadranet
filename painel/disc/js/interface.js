class Interface
{
    constructor( ARR ) {
        this.arr = ARR;
    }

    tpl( HOF ) {
       return this.arr.reduce(HOF, '');
    }
}