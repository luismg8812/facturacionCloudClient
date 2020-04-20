export class DataFacturaModel {
    public codigoNota:string;
    public tipoCorreccion:string;
    public descripcionCorrecion:string;
    public codigoFactura:string;
    public sssueDate:string;
    public issueTime:string;
    public invoiceTypeCode:string;
    public metodoDePago:string;
    public formaDePago:string;
    public paymentDueDate:string;
    
    constructor(){
        this.tipoCorreccion="";
        this.codigoNota="";
        this.descripcionCorrecion="";
        this.codigoFactura="";
        this.sssueDate="";
        this.issueTime="";
        this.invoiceTypeCode="";
        this.metodoDePago="";
        this.formaDePago="";
        this.paymentDueDate="";
       }
}

