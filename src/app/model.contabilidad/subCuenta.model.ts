
export class SubCuentaModel {
    codigo: string;
    nombre: string;
    sub_cuenta_id: number;
    cuenta_id: number;
    contructor() {
        this.codigo = "";
        this.nombre="";
        this.sub_cuenta_id=null;
        this.cuenta_id=null;
    }
}
