export class ClienteModel {
    public cliente_id:number;
    public empresa_id:number;
    public nombre:string;
    public apellidos:string;
    public documento:string;
    public ciudad_id:string;
    public barrio:string;
    public direccion:string;
    public celular:string;
    public fijo:string;
    public fecha_registro:Date;
    public credito_activo:number;
    public cupo_credito:string;
    public retencion:number;
    public mail:string;

    constructor(){
        this.nombre="";
        this.apellidos="";
        this.documento="";
        this.barrio="";
        this.direccion="";
        this.celular="";
        this.fijo="";
        this.fecha_registro=new Date();
        this.credito_activo=0;
        this.mail="";
    }
}

