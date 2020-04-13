import { FacturasModel } from './facturas.model';

export class DataJSONModel {
    public nitEmpresa: string;
    public facturas: FacturasModel[];
   

    constructor() {
        this.nitEmpresa = "";
        this.facturas =[];
       
    }
}

