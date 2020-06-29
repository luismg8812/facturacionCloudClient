export class AbonoModel {
    public abono_id:number;
    public documento_id:string;
    public fecha_ingreso:Date;
    public tipo_pago_id:string;
    public usuario_id:number;
    public cantidad:number;

    constructor(){
        this.abono_id=null;
        this.documento_id=null;
        this.fecha_ingreso=new Date();
        this.tipo_pago_id="";
        this.usuario_id=null;
        this.cantidad=0;
    }
}