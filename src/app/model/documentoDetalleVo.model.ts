export class DocumentoDetalleVoModel {
    public documento_id: string;
    public producto_id: string;
    public fecha_registro: Date;
    public parcial: string;
    public cantidad: string;
    public unitario: string;
    public costo_unitario: string;
    public cantidad_devolucion: string;
    public cambio_precio: string;
    public borrar: string;
    public cantidad1: string;
    public cantidad2: string;
    public iva: string;
    public nombre_producto: string;

    constructor(){
        this. documento_id="";
        this. producto_id="";
        this. fecha_registro=new Date;
        this. parcial="";
        this. cantidad="";
        this. unitario="";
        this. costo_unitario="";
        this. cantidad_devolucion="";
        this. cambio_precio="";
        this. borrar="";
        this. cantidad1="";
        this. cantidad2="";
        this.iva="";
        this.nombre_producto="";
    }
}
