import { DataImpuestosModel } from './dataImpuestos.model';
import { DataDescuentosModel } from './dataDescuentos.model';
import { DataImpuestosDetalleModel } from './dataImpuestosDetalle.model';

export class DataDetalleFacturaModel {
    public codigoProducto:string;
    public nombreProducto:string;
    public cantidad:string;
    public precio:string;
    public totalImpuestos:string;
    public totalDescuentos:string;
    public subtotal:string;
    public impuestos:DataImpuestosDetalleModel[];
    public descuentos:DataDescuentosModel[];
    
    constructor(){
        this.codigoProducto="";
        this.nombreProducto="";
        this.cantidad="";
        this.precio="";
        this.totalImpuestos="";
        this.totalDescuentos="";
        this.subtotal="";
        this.impuestos=[];
        this.descuentos=[];
       }
}

