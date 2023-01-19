export class DocumentoDetalleModel {
    public documento_detalle_id:string;
    public cotero_id:number;
    public documento_id:string;
    public producto_id:number;
    public procedencia_producto_id:number;
    public proveedor_id:number;
    public fecha_registro:Date;
    public estado:number;
    public parcial:number;
    public impreso_comanda:number;
    public cantidad:number;
    public unitario:number;
    public unitarioAntesIva:number;
    public nombre_producto:string;
    public costo_producto:number;
    public impuesto_producto:number;
    public peso_producto:number;
    public peso_cotero:number;
    public descripcion:string;
    public url_foto:string;
    public varios:number;
    public saldo:number;
    
    
    
    constructor(){
       this.documento_detalle_id=null;
       this.documento_id=null;
       this.producto_id=null; 
       this.cotero_id=null;
       this.proveedor_id=null;
       this.procedencia_producto_id=null;
       this.fecha_registro=new Date;
       this.estado=0;
       this.parcial=0;
       this.impreso_comanda=0;
       this.cantidad=0;
       this.unitario=0;
       this.costo_producto=0;
       this.nombre_producto="";
       this.impuesto_producto=0.0;
       this.peso_producto=0;
       this.peso_cotero=0;
       this.descripcion="";
       this.url_foto="";
       this.varios=0;
       this.saldo=0;
       this.unitarioAntesIva=0;
    }
}