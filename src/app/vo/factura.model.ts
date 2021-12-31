import { DocumentoModel } from '../model/documento.model';
import { DocumentoDetalleModel } from '../model/documentoDetalle.model';
import { EmpresaModel } from '../model/empresa.model';
import { ClienteModel } from '../model/cliente.model';
import { ProveedorModel } from '../model/proveedor.model';
import { ResolucionEmpresaModel } from '../model/resolucionEmpresa.model';
import { BonoModel } from '../model/bono.model';
import { BonoVOModel } from './bonoVO.model';
import { TipoPagoDocumentoModel } from '../model/tipoPagoDocumento.model';

export class FacturaModel {
    public documento:DocumentoModel;
    public bono:BonoVOModel;
    public detalle:DocumentoDetalleModel[];
    public empresa:EmpresaModel
    public cliente:ClienteModel;
    public proveedor:ProveedorModel;
    public titulo:string;
    public nombreTipoDocumento:string;
    public nombreUsuario:string;
    public nombreEmpleado:string;
    public tipoPago:string;
    public resolucionEmpresa:ResolucionEmpresaModel;
    public saldo:number;
    public pagaCon:number;
    public base64Logo:string;
    public tiposPago:TipoPagoDocumentoModel[];
    
    
    constructor(){
        this.documento=new DocumentoModel();
        this.bono=new BonoVOModel();
        this.resolucionEmpresa=new ResolucionEmpresaModel();
        this.detalle=[];
        this.tiposPago=[];
        this.titulo="";
        this.empresa=null;
        this.nombreTipoDocumento="";
        this.nombreUsuario="";
        this.nombreEmpleado="";
        this.cliente=null;
        this.proveedor=null;
        this.saldo=0;
        this.pagaCon=0;
        this.base64Logo="";
        this.tipoPago="";
    }
}

