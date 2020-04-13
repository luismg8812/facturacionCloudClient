import { DataClienteModel } from './dataCliente.model';
import { DataFacturaModel } from './dataFactura.model';
import { DataImpuestosModel } from './dataImpuestos.model';
import { DataFacturaTotalesModel } from './dataFacturaTotales.model';
import { DataDetalleFacturaModel } from './dataDetalleFactura.model';

export class FacturasModel {
    public dataCliente:DataClienteModel;
    public dataFactura:DataFacturaModel;
    public dataImpuestos:DataImpuestosModel[];
    public dataFacturaTotales:DataFacturaTotalesModel;
    public dataDetalleFactura:DataDetalleFacturaModel[];
    
    constructor(){
        this.dataCliente=new DataClienteModel();
        this.dataFactura=new DataFacturaModel();
        this.dataImpuestos=[];
        this.dataDetalleFactura=[];
       }
}

