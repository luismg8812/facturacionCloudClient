import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { InvoiceModel } from '../model/invoice.model';
import { DocumentoService } from '../services/documento.service';
import { DocumentoModel } from '../model/documento.model';
import { DocumentoMapModel } from '../facturacion.cloud.model/documentoMap.model';
import { DocumentoDetalleService } from '../services/documento-detalle.service';
import { EmpresaService } from '../services/empresa.service';
import { FacturacionElectronicaService } from '../services/facturacion-electronica.service';
import { CalculosService } from '../services/calculos.service';
import { DocumentoInvoiceModel } from '../model/documentoInvoice.model';
import { ClienteModel } from '../model/cliente.model';
import { ClienteService } from '../services/cliente.service';
import { GetFileModel } from '../facturacion.cloud.model/getFile.model';
import { AppConfigService } from '../services/app-config.service';
import { MailModel } from '../facturacion.cloud.model/mail.model';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-estado-documentos',
  templateUrl: './estado-documentos.component.html',
  styleUrls: ['./estado-documentos.component.css']
})
export class EstadoDocumentosComponent implements OnInit {

  public documentosSelectEnviar: Array<DocumentoModel> = [];
  public documentoMap: Array<DocumentoMapModel> = [];
  public estadosDocumento:Array<InvoiceModel>;
  public clientes: Array<ClienteModel>;
  public documentos: Array<DocumentoModel>;
  public empresaId: number;
  public enviados: number;
  public exitosos: number;
  public erroneos: number;
  public enviando:boolean=false;

  readonly INVOICE_SIN_ENVIAR: number = 1;
  readonly INVOICE_ENVIAR: number = 2;
  readonly INVOICE_ERROR: number = 4;
  readonly INVOICE_OK: number = 5;

  @ViewChild("downloadZipLink") downloadZipLink: ElementRef;

  constructor(public documentoService:DocumentoService,
    public documentoDetalleService: DocumentoDetalleService,
    public calculosService: CalculosService,
    public clienteService: ClienteService,
    public facturacionElectronicaService:FacturacionElectronicaService,
    public empresaService:EmpresaService) { }

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.invoiceList();
    this.getclientes(this.empresaId);
    this.getDocumentos(this.INVOICE_ERROR);
  }

  buscar(esdaDocu){
    this.getDocumentos(esdaDocu.value);
  }

  


  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  enviarDocumentos() {
    this.empresaService.getEmpresaById(this.empresaId.toString()).subscribe(empr => {
      this.enviados = 0;
      this.exitosos = 0;
      this.erroneos = 0;
      this.enviando=true;
      $('#envioModal').modal('hide');
      $('#enviardoModal').modal('show');
      for (let docu of this.documentoMap) {
        this.enviados++;
        this.facturacionElectronicaService.enviarFactura(this.calculosService.crearOjb(empr[0], docu, this.clientes)).subscribe(async res1 => {
          console.log(res1);
          if (res1.status == 'Error') {
            this.erroneos++;
          } else {
            this.exitosos++;
          }
          this.insertarEstado(res1, docu.documento);
          await this.delay(100);
          if (this.enviados == this.documentoMap.length) {
            // alert("El proceso de envio ha terminado")
            $("#ok").prop("disabled", false);
            this.getDocumentos(this.INVOICE_ERROR);
            this.enviando=false;
          }
          this.insertarEstado(res1, docu.documento);
         
        }, error => {
          console.error(error);
          alert("Ocurrio un error con el proceso de envios de sus documentos a la DIAN, por favor tome un pantallazo o foto del error y comuniquese a los siguientes canales a soporte:\nCelular: 3185222474\n" +
            "mail: info@effectivesoftware.com.co\n" +
            "Error: " + error.error
          )
        });
      }
    }, error => {
      console.error(error);
      alert("Ocurrio un error con el proceso de envios de sus documentos a la DIAN, por favor comuniquese a los siguientes canales a soporte:\nCelular: 3185222474\n" +
        "mail: info@effectivesoftware.com.co\n" +
        "Error: " + error.error
      )
      $('#envioModal').modal('hide');
    });
  }

  sendMail(res, docu: DocumentoModel){
    let mail:MailModel=new MailModel();
    let cliente = this.clientes.find(cliente => cliente.cliente_id == docu.cliente_id);
    if(cliente.mail==""){
      return;
    }
    if(docu.cufe==""){
      return;
    }
    mail.emailCliente=cliente.mail;
    mail.html=`<p> Estimado Cliente,</p>
    <b/>
    <p>a este correo encontrará la factura correspondiente a la contratación de servicios y/o adquisición de Productos.</p>
    <p>La factura electrónica que usted está recibiendo se conforma por dos archivos:</p>
    <p>\t1. La representación gráfica en formato .pdf que usted podrá imprimir</p>
    <p>\t2. La representación electrónica en formato .xml que usted deberá conservar</p>
    <p>Si su factura presenta algún error, le agradecemos a más tardar dentro de las siguientes 48 horas, dar “click” al “link” de rechazo que aparece en este correo. </p>
    <p>Saludos cordiales,</p>
    <p><b/></p>
    <p>EFFECTIVE SOFTWARE (Sistemas de facturacón e inventario)</p>
    `;  
    let getFile:GetFileModel=new GetFileModel();
    getFile.cufe=docu.cufe;
    getFile.key=AppConfigService.key_invoice;
    this.empresaService.getEmpresaById(this.empresaId.toString()).subscribe(empr => {
      getFile.nitEmpresa=empr[0].nit;
      this.facturacionElectronicaService.getXML(getFile).subscribe(async xml => {
        console.log(xml);
        mail.xml_64=xml.xmlBase64;
        mail.xml_name=xml.filename+".xml";
        this.facturacionElectronicaService.sendMail(mail).subscribe(async emai => {
          console.log(emai);
        },err=>{
          console.error("errr enviando correo");
        });
      });
    });
   // mail.xml_64=
  
   
  }

  insertarEstado(res, docu: DocumentoModel) {
    let documentoInvoice: DocumentoInvoiceModel = new DocumentoInvoiceModel();
    documentoInvoice.fecha_registro = new Date();
    documentoInvoice.documento_id = Number(docu.documento_id);
    documentoInvoice.status = res.status;
    if (res.status == "OK") {
      docu.cufe = res.cufe;
      docu.qrcode = res.qrCode;
      documentoInvoice.mensaje = res.mensaje;
      documentoInvoice.invoice_id = this.INVOICE_OK;
      docu.invoice_id = this.INVOICE_OK;
      this.sendMail(res, docu);
    } else {
      documentoInvoice.mensaje = res.mensaje + " " + documentoInvoice.mensaje + res.mensajeError;
      documentoInvoice.invoice_id = this.INVOICE_ERROR;
      docu.invoice_id = this.INVOICE_ERROR;
    }
    this.documentoService.updateDocumento(docu).subscribe(res => {
      if (res.code != 200) {
        alert("error creando documento, por favor inicie nuevamente la creación del documento");
        return;
      }
    });
    this.documentoService.saveInvoice(documentoInvoice).subscribe(res => {
      if (res.code == 200) {
        console.log("Se agrega estado para facturación electrónica");
      } else {
        console.error("error creando documento, por favor inicie nuevamente la creación del documento, si persiste consulte a su proveedor");
        return;
      }
    });
  }

   b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  DescargarXML(documento:DocumentoModel){
    let getFile:GetFileModel=new GetFileModel();
    getFile.cufe=documento.cufe;
    getFile.key=AppConfigService.key_invoice;
    this.empresaService.getEmpresaById(this.empresaId.toString()).subscribe(empr => {
      getFile.nitEmpresa=empr[0].nit;
      this.facturacionElectronicaService.getXML(getFile).subscribe(async res1 => {
      
          this.descargarArchivo(this.b64toBlob(res1.mensaje, 'text/xml'), "f_"+documento.consecutivo_dian + '.xml');
        
      });
    });  
  }

  descargarArchivo(contenidoEnBlob, nombreArchivo) {
    const url = window.URL.createObjectURL(contenidoEnBlob);
    const link = this.downloadZipLink.nativeElement;
    link.href = url;
    link.download = nombreArchivo;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'text/xml' });
    return blob;
  }

  limpiar(){
    this.documentoMap=[];
  }

  enviarUno(or:DocumentoModel){
    let docu: DocumentoMapModel = new DocumentoMapModel();
    docu.documento = or;
    this.documentoDetalleService.getDocumentoDetalleByDocumento(or.documento_id).subscribe(detalle => {
      docu.documentoDetalle = detalle;
      this.documentoMap.unshift(docu);
    });
    $('#envioModal').modal('show');
    
  }

  validarEnviar() {
    if (this.documentosSelectEnviar.length == 0) {
      alert("Debe seleccionar almenos 1 documento para ser enviado");
      return;
    }
    
  }

  selectAll(event) {
    if (event.target.checked) {
      this.documentosSelectEnviar = this.documentos;
      for (let or of this.documentosSelectEnviar) {
        let docu: DocumentoMapModel = new DocumentoMapModel();
        docu.documento = or;
        this.documentoDetalleService.getDocumentoDetalleByDocumento(or.documento_id).subscribe(detalle => {
          docu.documentoDetalle = detalle;
          this.documentoMap.unshift(docu);
        });
      }
    } else {
      this.documentoMap = [];
      this.documentosSelectEnviar = [];
    }
    console.log(event.target.checked);
    $('.allti').attr("checked", event.target.checked);
  }

  invoiceList(){ 
      this.documentoService.getInvoice().subscribe(res => {
        console.log(res);
        this.estadosDocumento = res;
      });
  }
  getDocumentos(invoice:number){
    this.documentoMap=[];
    this.documentoService.getDocumentoForFacturacionElectronica("", "", ['10','12','13'], "", "", invoice,  this.empresaId).subscribe(res => {
      console.log(res);
      this.documentos = res;
    });
  }

  formatearNumber(number: number) {
    let formato: string = "";
    formato = new Intl.NumberFormat().format(number);
    return formato;
  }

  nombreEstado(id) {
    let invoice = this.estadosDocumento.find(estados => estados.invoice_id == id);
    if (invoice == undefined) {
      return "";
    } else {
      return invoice.nombre;
    }
  }

  selectOrdenOne(or: DocumentoModel, event) {
    if (event.target.checked) {
      this.documentosSelectEnviar.unshift(or);
      let docu: DocumentoMapModel = new DocumentoMapModel();
      docu.documento = or;
      this.documentoDetalleService.getDocumentoDetalleByDocumento(or.documento_id).subscribe(detalle => {
        docu.documentoDetalle = detalle;
        this.documentoMap.unshift(docu);
      });
    } else {
      const index = this.documentosSelectEnviar.indexOf(or, 0);
      if (index > -1) {
        this.documentosSelectEnviar.splice(index, 1);
      }
      for (let i = 0; i < this.documentoMap.length; i++) {
        if (this.documentoMap[i].documento.documento_id == or.documento_id) {
          this.documentoMap.splice(i, 1);
          break;
        }
      }
    }
    console.log(this.documentoMap);
  }

  getclientes(empresaId: number) {
    this.clienteService.getClientesByEmpresa(empresaId.toString()).subscribe(res => {
      this.clientes = res;
      console.log("lista de clientes cargados: " + this.clientes.length);
    });
  }
  

}
