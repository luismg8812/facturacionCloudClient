export class DocumentoModel {
    public documento_id:string;
    public tipo_documento_id:number;
    public proveedor_id:number;
    public usuario_id:number;
    public cliente_id:number;
    public empleado_id:number;
    public empresa_id:number;
    public fecha_registro:Date;
    public consecutivo_dian:string;
    public impreso:number;
    public total:number;
    public excento:number;
    public gravado:number;
    public iva:number;
    public cierre_diario:number;
    public detalle_entrada:string;
    public saldo:number;
    public peso_total:number;
    public descuento:number;
    public cambio:number;
    public mac:string;
    public iva_19:number;
    public iva_5:number;
    public base_19:number;
    public base_5:number;
    public retefuente:number;
    public interes:number;
    public total_costo:number;
    public letra_consecutivo:string;
    public invoice:number;
    public anulado:number;
    

    constructor(){
        this. documento_id="";
        this. tipo_documento_id=null;
        this. proveedor_id=null;
        this. usuario_id=null;
        this. cliente_id=null;
        this. empleado_id=null;
        this.empresa_id=null;
        this. fecha_registro=new Date;
        this. consecutivo_dian="";
        this. impreso=0;
        this. total=0;
        this. excento=0;
        this. gravado=0;
        this. iva=0;
        this. cierre_diario=0;
        this. detalle_entrada="";
        this. saldo=0;
        this. peso_total=0;
        this. descuento=0;
        this. cambio=0;
        this. mac="";
        this. iva_19=0;
        this. iva_5=0;
        this. base_19=0;
        this. base_5=0;
        this.retefuente=0;
        this. interes=0;
        this. total_costo=0;
        this. letra_consecutivo="";
        this. invoice=0;
        this. anulado=0;
    };
}

