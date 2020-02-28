export class ProductoEmpleadoModel {
    public producto_empleado_id: number;
    public empleado_id: number;
    public valor:number;
    public concepto_producto:string;
    public fecha_registro: Date;
    public cierre_diario:number;
    

    constructor(){
        this.fecha_registro= new Date();
        this.concepto_producto="";
        this.cierre_diario=0;
    };
}