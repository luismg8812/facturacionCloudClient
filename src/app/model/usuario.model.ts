export class UsuarioModel {
    public usuarioId: string;
    public rolId: string;
    public nombre: string;
    public apellido: string;
    public correo: string;
    public clave: string;
    public fechaRegistro: Date;
    public identificacion: string;
    public estado: string;
    public login: string;

    constructor(){
        this.usuarioId="";
        this.rolId="";
        this.nombre="";
        this.apellido="";
        this.correo="";
        this.clave="";
        this.fechaRegistro=new Date();
        this.identificacion=""; 
        this.estado="";
        this.login="";
    };
}