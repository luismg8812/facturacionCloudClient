export class SubProductoModel {
    public sub_producto_id:number;
    public producto_padre:number;
    public producto_hijo:number;
    public cantidad:number;
    public estado:number;

    constructor(){
        this.sub_producto_id=null;
        this.producto_padre=null;
        this.producto_hijo=null;
        this.cantidad=0;
        this.estado=1;
    }
}