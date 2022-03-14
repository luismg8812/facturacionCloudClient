export class DocumentoModel {
    public documento_id:string;
    public tipo_documento_id:number;
    public proveedor_id:number;
    public usuario_id:number;
    public resolucion_empresa_id:number;
    public nota_id:number;
    public cliente_id:number;
    public empleado_id:number;
    public empresa_id:number;
    public modelo_marca_id:number;
    public fecha_registro:Date;
    public fecha_entrega:Date;
    public fecha_vencimiento:Date;
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
    public peso_cotero:number;
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
    public anulado:number;
    public descripcion_cliente:string;
    public descripcion_trabajador:string;
    public linea_vehiculo:string;
    public impresora:number;
    public invoice_id:number;
    public cufe:string;
    public qrcode:string;

    

    constructor(){
        this. documento_id="";
        this. tipo_documento_id=null;
        this. proveedor_id=null;
        this. usuario_id=null;
        this. cliente_id=null;
        this.nota_id=null;
        this. empleado_id=null;
        this.empresa_id=null;
        this.resolucion_empresa_id=null;
        this.modelo_marca_id = null;
        this. fecha_registro=new Date;
        this. fecha_entrega=new Date;
        this. fecha_vencimiento=new Date;
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
        this. peso_cotero=0;
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
        this. anulado=0;
        this.descripcion_cliente="";
        this.descripcion_trabajador="";
        this.linea_vehiculo="";
        this.impresora=0;
        this.invoice_id=null;
        this.cufe="";
        this.qrcode="";  
    };
}

