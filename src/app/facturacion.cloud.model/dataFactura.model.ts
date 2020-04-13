export class DataFacturaModel {
    public codigoFactura:string;
    public sssueDate:string;
    public issueTime:string;
    public invoiceTypeCode:string;
    public metodoDePago:string;
    public formaDePago:string;
    public paymentDueDate:string;
    
    constructor(){
        this.codigoFactura="";
        this.sssueDate="";
        this.issueTime="";
        this.invoiceTypeCode="";
        this.metodoDePago="";
        this.formaDePago="";
        this.paymentDueDate="";
       }
}

