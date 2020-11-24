import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import * as e from 'express';
import { DocumentoMapModel } from 'src/app/facturacion.cloud.model/documentoMap.model';
import { GetFileModel } from 'src/app/facturacion.cloud.model/getFile.model';
import { MailModel } from 'src/app/facturacion.cloud.model/mail.model';
import { ClienteModel } from 'src/app/model/cliente.model';
import { ConfiguracionModel } from 'src/app/model/configuracion.model';
import { DocumentoModel } from 'src/app/model/documento.model';
import { DocumentoDetalleModel } from 'src/app/model/documentoDetalle.model';
import { DocumentoInvoiceModel } from 'src/app/model/documentoInvoice.model';
import { EmpresaModel } from 'src/app/model/empresa.model';
import { InvoiceModel } from 'src/app/model/invoice.model';
import { AppConfigService } from 'src/app/services/app-config.service';
import { CalculosService } from 'src/app/services/calculos.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { DocumentoDetalleService } from 'src/app/services/documento-detalle.service';
import { DocumentoService } from 'src/app/services/documento.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { FacturacionElectronicaService } from 'src/app/services/facturacion-electronica.service';
import { ImpresionService } from 'src/app/services/impresion.service';
import { FacturaModel } from 'src/app/vo/factura.model';
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
  public itemsFactura: Array<DocumentoDetalleModel> = [];
  public factura: FacturaModel = new FacturaModel();;
  public estadosDocumento: Array<InvoiceModel>;
  public clientes: Array<ClienteModel>;
  public configuracion: ConfiguracionModel;
  public empresa: EmpresaModel;
  public documentos: Array<DocumentoModel>;
  public empresaId: number;
  public enviados: number;
  public exitosos: number;
  public erroneos: number;
  public enviando: boolean = false;
  public invoicesDocumento: Array<DocumentoInvoiceModel>;
  public ngxQrcode2: string = "123"

  readonly INVOICE_SIN_ENVIAR: number = 1;
  readonly INVOICE_ENVIAR: number = 2;
  readonly INVOICE_ERROR: number = 4;
  readonly INVOICE_OK: number = 5;

  @ViewChild("downloadZipLink") downloadZipLink: ElementRef;

  constructor(public documentoService: DocumentoService,
    public documentoDetalleService: DocumentoDetalleService,
    public calculosService: CalculosService,
    public clienteService: ClienteService,
    public facturacionElectronicaService: FacturacionElectronicaService,
    public impresionService: ImpresionService,
    public empresaService: EmpresaService) { }

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.invoiceList();
    this.getclientes(this.empresaId);
    this.getDocumentos(this.INVOICE_ERROR);
    this.getConfiguracion(this.empresaId);
    this.getEmpresa();
  }

  buscar(esdaDocu) {
    this.getDocumentos(esdaDocu.value);
  }




  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  detalleDocumento(documento: DocumentoModel) {
    this.documentoDetalleService.getDocumentoDetalleByDocumento(documento.documento_id).subscribe(res => {
      this.itemsFactura = res;
      console.log("detalles encontrados:" + res.length);
    });
  }

  enviarDocumentos() {
    this.empresaService.getEmpresaById(this.empresaId.toString()).subscribe(empr => {
      this.enviados = 0;
      this.exitosos = 0;
      this.erroneos = 0;
      this.enviando = true;
      $('#envioModal').modal('hide');
      $('#enviardoModal').modal('show');
      for (let docu of this.documentoMap) {
        this.enviados++;

        this.detalleDocumento(docu.documento);
        this.facturacionElectronicaService.enviarFactura(this.calculosService.crearOjb(empr[0], docu, this.clientes)).subscribe(async res1 => {
          console.log(res1);
          if (res1.status == 'Error') {
            this.erroneos++;
          } else {
            this.exitosos++;
          }
          //this.insertarEstado(env, docu.documento);
          await this.delay(100);
          if (this.enviados == this.documentoMap.length) {
            // alert("El proceso de envio ha terminado")
            $("#ok").prop("disabled", false);
            this.getDocumentos(this.INVOICE_ERROR);
            this.enviando = false;
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



  sendMail(res, docu: DocumentoModel) {
    let mail: MailModel = new MailModel();
    let cliente = this.clientes.find(cliente => cliente.cliente_id == docu.cliente_id);
    if (cliente.mail == "") {
      return;
    }
    if (docu.cufe == "") {
      return;
    }
    mail.emailCliente = cliente.mail;
    mail.html = `<p> Estimado Cliente,</p>
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
    let getFile: GetFileModel = new GetFileModel();
    getFile.cufe = docu.cufe;
    getFile.key = AppConfigService.key_invoice;

    this.empresaService.getEmpresaById(this.empresaId.toString()).subscribe(async empr => {
      getFile.nitEmpresa = empr[0].nit;
      mail.pdf_64 = this.getfacturaPDF(docu, empr[0]);
      await this.delay(500);
      this.facturacionElectronicaService.getXML(getFile).subscribe(async xml => {
        console.log(xml);
        mail.xml_64 = xml.mensaje;

        mail.pdf_name = "f_" + docu.consecutivo_dian + ".pdf"; //+xml.filename;
        mail.xml_name = "f_" + docu.consecutivo_dian + ".xml"; //+xml.filename;
        this.facturacionElectronicaService.sendMail(mail).subscribe(async emai => {
          console.log(emai);
        }, err => {
          console.error("errr enviando correo");
        });
      });
    });
    // mail.xml_64=


  }

  getfacturaPDF(docu: DocumentoModel, empresa: EmpresaModel) {

    var myimg64 = $("#qrcode1").find("img").attr("src");
    //console.log("base65");
    //console.log(myimg64);
    docu.qrcode = myimg64;
    let tituloDocumento = "factura" + "_" + docu.consecutivo_dian + "_" + docu.impresora;
    this.factura.documento = docu;
    this.factura.nombreTipoDocumento = "FACTURA DE VENTA";
    this.factura.detalle = this.itemsFactura;
    this.factura.titulo = tituloDocumento;
    this.factura.empresa = empresa;
    this.factura.nombreUsuario = localStorage.getItem("nombreUsuario");
    let stri: string = this.impresionService.imprimirFacturaPDFExportar(this.factura, this.configuracion);
    console.log(stri);
    return stri;

  }

  insertarEstado(res, docu: DocumentoModel) {
    let documentoInvoice: DocumentoInvoiceModel = new DocumentoInvoiceModel();
    documentoInvoice.fecha_registro = new Date();
    documentoInvoice.documento_id = Number(docu.documento_id);
    documentoInvoice.status = res.status;

    if (res.status == "OK") {
      docu.cufe = res.cufe;
      this.ngxQrcode2 = res.qrCode;
      docu.qrcode = res.qrCode;
      documentoInvoice.mensaje = res.mensaje;
      documentoInvoice.invoice_id = this.INVOICE_OK;
      docu.invoice_id = this.INVOICE_OK;
      this.sendMail(res, docu);
    }
    if (res.status == "Error") {
      documentoInvoice.mensaje = res.mensaje + " " + documentoInvoice.mensaje + res.mensajeError;
      documentoInvoice.invoice_id = this.INVOICE_ERROR;
      docu.invoice_id = this.INVOICE_ERROR;
    }

    if (res.status == "") {
      documentoInvoice.mensaje = "Enviado a la DIAN";
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

  b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
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

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  descargarPDF(docu: DocumentoModel) {
    this.clienteService.getById(this.empresaId.toString()).subscribe(clien => {
      this.documentoDetalleService.getDocumentoDetalleByDocumento(docu.documento_id).subscribe(res => {
        //this.ngxQrcode2=docu.qrCode;
        //var myimg64 = $("#qrcode1").find("img").attr("src");
        //console.log("base65");
        //console.log(myimg64);
        //docu.qrcode=myimg64;
        let tituloDocumento = "factura" + "_" + docu.consecutivo_dian + "_" + docu.impresora;
        this.factura.documento = docu;
        this.factura.nombreTipoDocumento = "FACTURA DE VENTA";
        this.factura.detalle = res;
        this.factura.titulo = tituloDocumento;
        this.factura.empresa = this.empresa;
        this.factura.cliente = clien[0];
        this.factura.nombreUsuario = localStorage.getItem("nombreUsuario");
        let stri: string = this.impresionService.imprimirFacturaPDFCarta(this.factura, this.configuracion, false);
      });
    });
  }

  descargarXML(documento: DocumentoModel) {
    let getFile: GetFileModel = new GetFileModel();
    getFile.cufe = documento.cufe;
    getFile.key = AppConfigService.key_invoice;
    this.empresaService.getEmpresaById(this.empresaId.toString()).subscribe(empr => {
      getFile.nitEmpresa = empr[0].nit;
      this.facturacionElectronicaService.getXML(getFile).subscribe(async res1 => {
        console.log(res1);
        this.descargarArchivo(this.b64toBlob(res1.mensaje, 'text/xml'), "f_" + documento.consecutivo_dian + '.xml');

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

  invoiceDocumento(docu: DocumentoModel) {
    this.documentoService.getDocumentoInvoiceByDocumento(docu.documento_id).subscribe(res => {
      this.invoicesDocumento = res;
    });
  }

  limpiar() {
    this.documentoMap = [];
  }

  enviarUno(or: DocumentoModel) {
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
    $('#envioModal').modal('show');
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

  invoiceList() {
    this.documentoService.getInvoice().subscribe(res => {
      console.log(res);
      this.estadosDocumento = res;
    });
  }
  getDocumentos(invoice: number) {
    this.documentoMap = [];
    this.documentoService.getDocumentoForFacturacionElectronica("", "", ['10', '12', '13'], "", "", invoice, this.empresaId).subscribe(res => {
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

  getConfiguracion(empresaId: number) {
    this.clienteService.getConfiguracionByEmpresa(empresaId.toString()).subscribe(res => {
      this.configuracion = res[0];
    });
  }

  getEmpresa() {
    this.empresaService.getEmpresaById(this.empresaId.toString()).subscribe(res => {
      this.empresa = res[0];
    });
  }

}
