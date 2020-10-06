import { GrupoModel } from './grupo.model';

export class ClaseModel {
    codigo: string;
    nombre: string;
    grupo: GrupoModel[];
    contructor() {
        this.codigo = "";
        this.nombre="";
        this.grupo = [];
    }
}
