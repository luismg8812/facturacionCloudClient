export class DocumentoInvoiceModel {
    public documento_invoice_id:number;
    public documento_id:number;
    public invoice_id:number;
    public fecha_registro:Date;
    public mensaje:string;
    public status:string;

    constructor(){
        this.documento_invoice_id=null;
        this.documento_id=null;
        this.invoice_id=null;
        this.fecha_registro=new Date();
        this.mensaje="";
        this.status="";
    }
}