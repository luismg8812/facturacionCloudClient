export class ProductoModel {
    public producto_id:number;
    public empresa_id:number;
    public grupo_id:string;
    public sub_grupo_id:string;
    public proveedor_id:string;
    public marca_id:string;
    public fecha_registro:Date;
    public fecha_vencimiento:Date;
    public costo:number;
    public costo_publico:number;
    public impuesto:number;
    public stock_min:number;
    public stock_max:number;
    public codigo_barras:string;
    public peso:number;
    public balanza:number;
    public nombre:string;
    public cantidad:number;
    public promo:number;
    public pub_promo:number;
    public estado:number;
    public kg_promo:number;
    public varios:number;
    public activo:string;
    public utilidad_sugerida:number;
    public sub_producto:number;
    public granel:number;
    public porcentaje_venta:number;
    


    constructor(){
        this.producto_id=null;
        this.empresa_id=null;
        this. grupo_id=null;
        this. sub_grupo_id=null;
        this. proveedor_id=null;
        this. marca_id=null;
        this. fecha_registro=new Date();
        this. fecha_vencimiento=null;
        this. costo=0;
        this. costo_publico=0;
        this. impuesto=0;
        this. stock_min=0;
        this. stock_max=0;
        this. codigo_barras="";
        this. peso=0;
        this. balanza=0;
        this. nombre="";
        this. cantidad=0;
        this. promo=0;
        this. pub_promo=0;
        this. estado=1;
        this. kg_promo=0;
        this. varios=0;
        this. utilidad_sugerida=0;
        this. sub_producto=0;
        this. granel=0;
        this.porcentaje_venta=0;
    }
}
