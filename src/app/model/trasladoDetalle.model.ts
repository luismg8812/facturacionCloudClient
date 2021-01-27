export class TrasladoDetalleModel {
    public traslado_detalle_id:string;
    public traslado_id:number;
    public producto_id:number;
    public fecha_registro:Date;
    public cantidad_traslado:number;
    public cantidad_aceptada:number;
    public cantidad_rechazada:number;
    public estado:number;
    public unitario:number;
    public parcial:number;
    public descripcion:string;
        
    constructor(){
       this.traslado_detalle_id=null;
       this.traslado_id=null;
       this.producto_id=null; 
       this.fecha_registro=new Date;
       this.estado=0;
       this.parcial=0;
       this.cantidad_traslado=0;
       this.cantidad_aceptada=0;
       this.cantidad_rechazada=0;
       this.unitario=0;
       this.descripcion="";
    }
}