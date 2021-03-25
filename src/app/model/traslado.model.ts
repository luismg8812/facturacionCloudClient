export class TrasladoModel {
    public traslado_id:number;
    public requerimiento_id:number;
    public empresa_origen_id:number;
    public empresa_destino_id:number;
    public fecha_registro:Date;
    public usuario_crea_id:number;
    public usuario_aprueba_id:number;
    public observacion:string;
    public estado:number;
    public total:number;

    constructor(){
        this.traslado_id=null;
        this.requerimiento_id=null;
        this.empresa_origen_id=null;
        this.empresa_destino_id=null;
        this.usuario_crea_id=null;
        this.usuario_aprueba_id=null;
        this.observacion="";
        this.fecha_registro=new Date();
        this.total=0;
        this.estado=0;
    }
}