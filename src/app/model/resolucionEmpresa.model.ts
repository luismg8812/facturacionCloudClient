export class ResolucionEmpresaModel {
    public resolucion_empresa_id:number;
    public empresa_id:number;
    public resolucion_dian:string;
    public nombre:string;
    public letra_consecutivo:string;
    public autorizacion_desde:number;
    public autorizacion_hasta:number;
    public fecha_resolucion:Date;
    public consecutivo:number;
    public t_factura:string; 

    constructor(){
        this.empresa_id=1;
        this.resolucion_empresa_id=null;
        this.resolucion_dian="";
        this.nombre="";
        this.letra_consecutivo="";
        this.fecha_resolucion=new Date();
        this.consecutivo=null;
        this.autorizacion_desde=1
        this.autorizacion_hasta=1000 
        this.t_factura="Factura impresa por computador";
    }
}