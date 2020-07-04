export class GrupoModel {
    public grupo_id:number;
    public empresa_id:number;
    public nombre:string;
    
    constructor(){
        this.nombre="";
        this.empresa_id=null;
        this.grupo_id=null;
    }
}