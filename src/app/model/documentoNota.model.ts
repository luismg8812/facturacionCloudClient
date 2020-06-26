export class DocumentoNotaModel {
    public documento_nota_id:string;
    public documento_id:string;
    public nota_id:number;
    public fecha_registro:Date;
    public estado:number;

    constructor(){
        this.documento_nota_id=null;
        this.documento_id=null;
        this.nota_id=null;
        this.estado=0;
        this.fecha_registro=new Date();
    }
}