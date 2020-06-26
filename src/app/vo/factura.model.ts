import { DocumentoModel } from '../model/documento.model';
import { DocumentoDetalleModel } from '../model/documentoDetalle.model';
import { EmpresaModel } from '../model/empresa.model';
import { ClienteModel } from '../model/cliente.model';
import { ProveedorModel } from '../model/proveedor.model';

export class FacturaModel {
    public documento:DocumentoModel;
    public detalle:DocumentoDetalleModel[];
    public empresa:EmpresaModel
    public cliente:ClienteModel;
    public proveedor:ProveedorModel;
    public titulo:string;
    public nombreTipoDocumento:string;
    public nombreUsuario:string;
    public nombreEmpleado:string;
    
    
    constructor(){
        this.documento=new DocumentoModel();
        this.detalle=[];
        this.titulo="";
        this.empresa=null;
        this.nombreTipoDocumento="";
        this.nombreUsuario="";
        this.nombreEmpleado="";
        this.cliente=null;
        this.proveedor=null;
    }
}

