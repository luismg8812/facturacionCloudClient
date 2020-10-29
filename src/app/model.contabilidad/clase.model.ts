import { GrupoModel } from './grupo.model';

export class ClaseModel {
    codigo: string;
    nombre: string;
    clase_id:number;
    empresa_id:number;
    contructor() {
        this.codigo = "";
        this.nombre="";
        this.clase_id=null;
        this.empresa_id=null;
    }
}
