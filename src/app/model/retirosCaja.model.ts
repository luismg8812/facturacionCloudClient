export class RetirosCajaModel {
    public retiro_caja_id:number;
    public usuario_hace_id:number;
    public usuario_aplica_id:number;
    public empresa_id:number;
    public valor:number;
    public cierre_diario:number;
    public fecha_registro:Date;
    public descripcion:string;

    constructor(){ 
        this.retiro_caja_id=null;
        this.usuario_hace_id=null;
        this.usuario_aplica_id=null;
        this.fecha_registro=new Date();
        this.valor=0;
        this.cierre_diario=0;
        this.empresa_id=null;
        this.descripcion="";
    }
}