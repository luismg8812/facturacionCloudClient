export class SubGrupoModel {
    public sub_grupo_id:number;
    public empresa_id:number;
    public nombre:string;
    
    constructor(){
        this.nombre="";
        this.empresa_id=null;
        this.sub_grupo_id=null;
    }
}