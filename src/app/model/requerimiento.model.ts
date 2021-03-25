export class RequerimientoModel {
    public requerimiento_id:number;
    public empresa_id:number;
    public usuario_id:number;
    public fecha_registro:Date;
    public estado:number;
    public total:number;
    public observacion:string;

    constructor(){
        this.requerimiento_id=null;
        this.empresa_id=null;
        this.usuario_id=null;
        this.fecha_registro=new Date();
        this.estado=0;
        this.total=0;
        this.observacion="";
    }
}