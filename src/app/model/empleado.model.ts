export class EmpleadoModel {
    public empleado_id: number;
    public empresa_id:number;
    public nombre: string;
    public apellido: string;
    public identificacion: string;
    public telefono:string;
    public estado: string;
    
    public pago_empleado_id: number;
    public porcentaje_pago: number;
    public sueldo: number;
    public pago_admin: number;
    public porcentaje_descuento: number;

    constructor(){
        this.empleado_id= 0,
        this.empresa_id= 0,
        this.nombre= "",
        this.apellido= "",
        this.telefono= "",
        this.identificacion= "",
        this.estado= "",
        this.pago_empleado_id=0,
        this.porcentaje_pago=0,
        this.sueldo=0,
        this.pago_admin=0
        this.porcentaje_descuento=0;
    };
}