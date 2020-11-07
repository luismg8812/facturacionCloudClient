export class VehiculoModel {
    public vehiculo_id:number;
    public cliente_id:number;
    public marca_vehiculo_id:number;
    public modelo_marca_id:number;
    public placa:string;
    public linea_vehiculo:string;

    constructor(){
        this.vehiculo_id=null;
        this.cliente_id=null;
        this.marca_vehiculo_id=null;
        this.modelo_marca_id=null;
        this.placa="";
        this.linea_vehiculo="";
    }
}