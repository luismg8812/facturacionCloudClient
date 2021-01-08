export class RequerimientoDetalleModel {
    public requerimiento_detalle_id:number;
    public requerimiento_id:number;
    public producto_id:number;
    public fecha_registro:Date;
    public estado:number;
    public parcial:number;
    public cantidad:number;
    public unitario:number;
    public descripcion:string;
     
    constructor(){
       this.requerimiento_detalle_id=null;
       this.requerimiento_id=null;
       this.producto_id=null; 
       this.fecha_registro=new Date;
       this.estado=0;
       this.parcial=0;  
     this.cantidad=0;
       this.unitario=0;
       this.descripcion="";
    }
}