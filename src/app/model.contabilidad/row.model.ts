import { GrupoModel } from './grupo.model';

export class RowModel {
    codigo: string;
    nombre: string;
    tipo:string;
    id:number;
    contructor() {
        this.codigo = "";
        this.nombre="";
        this.tipo="";
        this.id=null;
    }
}
