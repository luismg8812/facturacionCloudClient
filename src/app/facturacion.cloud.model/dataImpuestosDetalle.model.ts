export class DataImpuestosDetalleModel {
    public codigoImpuesto: string;
    public nombreImpuesto: string;
    public porcentajeImpuesto: string;
    public valorImpuestoCalculado: string;
    public subtotalBase:string;

    constructor() {
        this.codigoImpuesto = "";
        this.nombreImpuesto = "";
        this.porcentajeImpuesto = ""; 
        this.valorImpuestoCalculado = "";
    }
}

