import { DataImpuestosModel } from './dataImpuestos.model';
import { DataDescuentosModel } from './dataDescuentos.model';

export class DataDetalleFacturaModel {
    public codigoProducto:string;
    public nombreProducto:string;
    public cantidad:string;
    public precio:string;
    public totalImpuestos:string;
    public totalDescuentos:string;
    public subtotal:string;
    public impuestos:DataImpuestosModel[];
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

