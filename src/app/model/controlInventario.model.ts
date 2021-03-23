export class ControlInventarioModel {
    public control_inventario_id:number;
    public producto_id:number;
    public empresa_id:number;
    public inicial:number;
    public entrada:number;
    public venta:number;
    public fecha_cierre:Date;

    constructor(){
        this.control_inventario_id=null;
        this.producto_id=null;
        this.empresa_id=null;
        this.inicial=0;
        this.entrada=0;
        this.venta=0;
        this.fecha_cierre=new Date();
    }
}