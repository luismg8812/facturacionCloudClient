import { DocumentoModel } from '../model/documento.model';
import { DocumentoDetalleModel } from '../model/documentoDetalle.model';
import { EmpresaModel } from '../model/empresa.model';
import { ClienteModel } from '../model/cliente.model';
import { ProveedorModel } from '../model/proveedor.model';
import { ResolucionEmpresaModel } from '../model/resolucionEmpresa.model';
import { BonoModel } from '../model/bono.model';

export class BonoVOModel {
    public bono:BonoModel;
    public placa:string;
    public linea:string;
   
    constructor(){
        this.bono=new BonoModel();
        this.placa="";
        this.linea="";
    }
}

