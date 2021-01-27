import { InformeDiarioModel } from './informeDiario.model';
import { EmpresaModel } from './empresa.model';
import { DocumentoModel } from './documento.model';

export class InformeDiarioVOModel {
    public informe_diario:any;
    public empresa:EmpresaModel;
    public detalle:Array<DocumentoModel>
    public tituloArchivo:string;
    constructor(){
        this.informe_diario=new InformeDiarioModel();
        this.empresa=null;
        this.tituloArchivo="";
        this.detalle=[];
    }
}

