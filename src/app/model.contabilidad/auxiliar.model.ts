
export class AuxiliarModel {
    codigo: string;
    nombre: string;
    sub_cuenta_id: number;
    auxiliar_id: number;
    categoria_id:number;
    vencimiento_id:number;
    diferencia_fiscal:number;
    estado:number;

    contructor() {
        this.codigo = "";
        this.nombre="";
        this.sub_cuenta_id=null;
        this.auxiliar_id=null;
        this.categoria_id=null;
        this.vencimiento_id=null;
        this.diferencia_fiscal=0;
        this.estado=0;
    }
}
