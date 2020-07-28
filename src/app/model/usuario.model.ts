export class UsuarioModel {
    public usuario_id: number;
    public empresa_id:number;
    public nombre: string;
    public apellido: string;
    public correo: string;
    public clave: string;
    public fecha_registro: Date;
    public identificacion: string;
    public estado: string;
    public tipoVinculacion: string;
    public supervisor: string;
    public area: string;
    public sede: string;
    public puesto: string;

    constructor(){
        this.usuario_id= 0,
        this.empresa_id= 0,
        this.nombre= "",
        this.apellido= "",
        this.correo= "",
        this.clave= "",
        this.fecha_registro= new Date(),
        this.identificacion= "",
        this.estado= "",
        this.tipoVinculacion= "",
        this.supervisor= "",
        this.area= "",
        this.sede= "",
        this.puesto= ""
    };
}