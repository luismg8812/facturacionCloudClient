export class DocumentoDetalleModel {
    public documento_detalle_id:string;
    public documento_id:string;
    public producto_id:number;
    public fecha_registro:Date;
    public estado:number;
    public parcial:number;
    public impresoComanda:number;
    public cantidad:number;
    public unitario:number;
    public nombre_producto:string;
    public costo_producto:number;
    public impuesto_producto:number;
    public peso_producto:number;
    public descripcion:string;
    public url_foto:string;
    
    
    constructor(){
       this.documento_detalle_id=null;
       this.documento_id=null;
       this.producto_id=null; 
       this.fecha_registro=new Date;
       this.estado=0;
       this.parcial=0;
       this.impresoComanda=0;
       this.cantidad=0;
       this.unitario=0;
       this.costo_producto=0;
       this.nombre_producto="";
       this.impuesto_producto=0.0;
       this.peso_producto=0;
       this.descripcion="";
       this.url_foto="";
    }
}