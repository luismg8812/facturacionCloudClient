import { DocumentoModel } from '../model/documento.model';
import { DocumentoDetalleModel } from '../model/documentoDetalle.model';
import { EmpresaModel } from '../model/empresa.model';
import { ClienteModel } from '../model/cliente.model';

export class FacturaModel {
    public documento:DocumentoModel;
    public detalle:DocumentoDetalleModel[];
    public empresa:EmpresaModel
    public cliente:ClienteModel;
    public titulo:string;
    public nombreTipoDocumento:string;
    public nombreUsuario:string;
    
    
    constructor(){
        this.documento=new DocumentoModel();
        this.detalle=[];
        this.titulo="";
        this.empresa=null;
        this.nombreTipoDocumento="";
        this.nombreUsuario="";
        this.cliente=null;
    }
}

