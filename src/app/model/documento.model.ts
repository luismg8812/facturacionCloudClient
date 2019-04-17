export class DocumentoModel {
    public documento_id:string;
    public tipo_documento_id:string;
    public proveedor_id:string;
    public usuario_id:string;
    public cliente_id:string;
    public empleado_id:string;
    public fecha_registro:Date;
    public consecutivo_dian:string;
    public impreso:string;
    public total:string;
    public excento:string;
    public gravado:string;
    public iva:string;
    public cierre_diario:string;
    public detalle_entrada:string;
    public saldo:string;
    public peso_total:string;
    public descuento:string;
    public cambio:string;
    public mac:string;
    public iva_19:string;
    public iva_5:string;
    public base_19:string;
    public base_5:string;

    constructor(){
        this. documento_id="";
        this. tipo_documento_id="";
        this. proveedor_id="";
        this. usuario_id="";
        this. cliente_id="";
        this. empleado_id="";
        this. fecha_registro=new Date;
        this. consecutivo_dian="";
        this. impreso="";
        this. total="";
        this. excento="";
        this. gravado="";
        this. iva="";
        this. cierre_diario="";
        this. detalle_entrada="";
        this. saldo="";
        this. peso_total="";
        this. descuento="";
        this. cambio="";
        this. mac="";
        this. iva_19="";
        this. iva_5="";
        this. base_19="";
        this. base_5="";
    };
}

