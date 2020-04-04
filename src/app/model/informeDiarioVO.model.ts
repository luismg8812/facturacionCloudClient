import { InformeDiarioModel } from './informeDiario.model';
import { EmpresaModel } from './empresa.model';

export class InformeDiarioVOModel {
    public informe_diario:InformeDiarioModel;
    public empresa:EmpresaModel;
    public tituloArchivo:string;
    constructor(){
        this.informe_diario=new InformeDiarioModel();
        this.empresa=null;
        this.tituloArchivo="";
    }
}

