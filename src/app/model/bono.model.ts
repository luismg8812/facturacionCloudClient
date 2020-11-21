export class BonoModel {
    public bono_id:number;
    public vehiculo_id:number;
    public documento_id:number;
    public empresa_id:number;
    public tipo_bono_id:number;
    public observacion:string;
    public usuario_id:number;
    public total:number;
    public estado:string;
    public fecha_registro:Date;
    public fecha_uso:Date;

    constructor(){
        this.bono_id=null;
        this.vehiculo_id=null;
        this.documento_id=null;
        this.tipo_bono_id=null;
        this.empresa_id=null;
        this.observacion="";
        this.estado="";
        this.usuario_id=null;
        this.total=0;
        this.fecha_registro=new Date();
        this.fecha_uso=new Date();
    }
}