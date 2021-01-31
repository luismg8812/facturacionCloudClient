export class TipoPagoDocumentoModel {
    public tipo_pago_documento_id:number;
    public tipo_pago_id:number;
    public documento_id:string;
    public fecha_registro:Date;
    public valor:number;
    public nombre:string;

    constructor(){
        this.tipo_pago_documento_id=null;
        this.tipo_pago_id=null;
        this.documento_id=null;
        this.fecha_registro=new Date;
        this.valor=0;
        this.nombre="";
    }
}

