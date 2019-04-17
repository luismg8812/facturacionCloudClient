export class DocumentoDetalleModel {
    public documentoDetalleId:string;
    public documentoId:string;
    public productoId:string;
    public fechaRegistro:Date;
    public fechaActualiza:Date;
    public estado:string;
    public parcial:string;
    public s1:string;
    public s2:string;
    public cantidad2:string;
    public cantidad1:string;
    public impresoComanda:string;
    public cantidad:string;
    public unitario:string;
    
    constructor(){
       this.documentoDetalleId="";
       this.documentoId="";
       this.productoId=""; 
       this.fechaRegistro=new Date;
       this.fechaActualiza=new Date;
       this.estado="";
       this.parcial="";
       this.s1="";
       this.s2="";
       this.cantidad2="";
       this.cantidad1="";
       this.impresoComanda="";
       this.cantidad="";
       this.unitario="";
    }
}