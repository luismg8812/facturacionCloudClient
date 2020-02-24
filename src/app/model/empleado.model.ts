export class EmpleadoModel {
    public empleado_id: number;
    public empresa_id:number;
    public nombre: string;
    public apellido: string;
    public identificacion: string;
    public telefono:string;
    public estado: string;

    constructor(){
        this.empleado_id= 0,
        this.empresa_id= 0,
        this.nombre= "",
        this.apellido= "",
        this.telefono= "",
        this.identificacion= "",
        this.estado= ""
    };
}