export class InformeDiarioModel {
    public informe_diario_id:number;
    public empresa_id:number;
    public total_ventas:number;
    public total_remisiones:number;
    public iva_ventas:number;
    public iva_remisiones:number;
    public fecha_ingreso:Date;
    public fecha_informe:string;
    public costo_ventas:number;
    public costo_remisiones:number;
    public cantidad_documentos:number;
    public documento_inicio:string;
    public documento_fin:string;
    public iva_5:number;
    public iva_19:number;
    public base_5:number;
    public base_19:number;
    public excento:number;
    public iva_5_compras:number;
    public Iva_19_compras:number;
    public base_19_compras:number;
    public base_5_compras:number;
    public excento_compras:number;
    public cierre_diario:number;
   

    constructor(){
        this.informe_diario_id=null;
        this.empresa_id=null;
        this.total_ventas=0;
        this.total_remisiones=0;
        this.iva_ventas=0;
        this.iva_remisiones=0;
        this.fecha_ingreso=new Date();
        this.fecha_informe=null;
        this.costo_ventas=0;
        this.costo_remisiones=0;
        this.cantidad_documentos=0;
        this.documento_inicio="";
        this.documento_fin="";
        this.iva_5=0;
        this.iva_19=0;
        this.base_5=0;
        this.base_19=0;
        this.excento=0;
        this.iva_5_compras=0;
        this.Iva_19_compras=0;
        this.base_19_compras=0;
        this.base_5_compras=0;
        this.excento_compras=0;
        this.cierre_diario=0;
    }
}

