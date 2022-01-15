export class AuditoriaModel {
    public auditoria_id:number;
    public accion_auditoria_id:number;
    public usuario_id:number;
    public valor_anterior:string;
    public valor_actual:string;
    public aplicativo:string;
    public observacion:string;
    public empresa_id:number;
    public fecha_registro:Date;

    constructor(){
        this.auditoria_id=null;
        this.accion_auditoria_id=null;
        this.usuario_id=null;
        this.valor_anterior="";
        this.valor_actual="";
        this.aplicativo="";
        this.observacion="";
        this.empresa_id=null;
        this.fecha_registro=new Date();
    }
}