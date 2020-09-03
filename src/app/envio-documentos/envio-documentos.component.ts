import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DocumentoModel } from '../model/documento.model';
import { DocumentoService } from '../services/documento.service';
import { ClienteModel } from '../model/cliente.model';
import { ClienteService } from '../services/cliente.service';
import { EnvioFacturacionElectronicaModel } from '../facturacion.cloud.model/envioFacturacionElectronica.model';
import { EmpresaService } from '../services/empresa.service';
import { EmpresaModel } from '../model/empresa.model';
import { FacturacionElectronicaService } from '../services/facturacion-electronica.service';
import { CalculosService } from '../services/calculos.service';
import { DocumentoDetalleService } from '../services/documento-detalle.service';
import { DocumentoDetalleModel } from '../model/documentoDetalle.model';
import { DocumentoMapModel } from '../facturacion.cloud.model/documentoMap.model';
import { DataJSONModel } from '../facturacion.cloud.model/datajson.model';
import { FacturasModel } from '../facturacion.cloud.model/facturas.model';
import { DataClienteModel } from '../facturacion.cloud.model/dataCliente.model';
import { DataFacturaModel } from '../facturacion.cloud.model/dataFactura.model';
import { DataFacturaTotalesModel } from '../facturacion.cloud.model/dataFacturaTotales.model';
import { DataImpuestosModel } from '../facturacion.cloud.model/dataImpuestos.model';
import { DataDetalleFacturaModel } from '../facturacion.cloud.model/dataDetalleFactura.model';
import { DataDescuentosModel } from '../facturacion.cloud.model/dataDescuentos.model';
import { DocumentoInvoiceModel } from '../model/documentoInvoice.model';
import { DataImpuestosDetalleModel } from '../facturacion.cloud.model/dataImpuestosDetalle.model';
import { AppConfigService } from '../services/app-config.service';
import { ImpresionService } from '../services/impresion.service';
import { TipoDocumentoModel } from '../model/tipoDocumento.model';
import { MailModel } from '../facturacion.cloud.model/mail.model';
import { GetFileModel } from '../facturacion.cloud.model/getFile.model';
import { FacturaModel } from '../vo/factura.model';
import { ConfiguracionModel } from '../model/configuracion.model';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-envio-documentos',
  templateUrl: './envio-documentos.component.html',
  styleUrls: ['./envio-documentos.component.css']
})
export class EnvioDocumentosComponent implements OnInit {

  public documentos: Array<DocumentoModel>;
  public documentoMap: Array<DocumentoMapModel> = [];
  public documentosSelectEnviar: Array<DocumentoModel> = [];
  public itemsFactura: Array<DocumentoDetalleModel> = [];
  public enviado: EnvioFacturacionElectronicaModel;
  public tiposDocumento: Array<TipoDocumentoModel>;
  public empresaId: number;
  public clientes: Array<ClienteModel>;
  public configuracion: ConfiguracionModel;
  public enviados: number;
  public exitosos: number;
  public erroneos: number;
  public empresa: EmpresaModel;
  public factura: FacturaModel = new FacturaModel();;
  public enviando: boolean = false;
  readonly INVOICE_SIN_ENVIAR: number = 1;
  readonly INVOICE_ENVIAR: number = 2;
  readonly INVOICE_DESCARTAR: number = 3;
  readonly INVOICE_ERROR: number = 4;
  readonly INVOICE_OK: number = 5;
  public ngxQrcode2: string = "123"

  @ViewChild("downloadZipLink") downloadZipLink: ElementRef;


  constructor(public documentoService: DocumentoService,
    public calculosService: CalculosService,
    public empresaService: EmpresaService,
    public impresionService: ImpresionService,
    public documentoDetalleService: DocumentoDetalleService,
    public facturacionElectronicaService: FacturacionElectronicaService,
    public clienteService: ClienteService) { }

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.getTiposDocumento();
    this.getclientes(this.empresaId);
    this.getDocumentos();


  }

  exportar() {
    if (this.documentosSelectEnviar.length == 0) {
      alert("Debe seleccionar almenos 1 documento para ser exportado");
      return;
    }
    this.empresaService.getEmpresaById(this.empresaId.toString()).subscribe(empr => {
      let envi: Array<EnvioFacturacionElectronicaModel> = [];
      for (let docu of this.documentoMap) {
        envi.unshift(this.calculosService.crearOjb(empr[0], docu, this.clientes));
      }
      this.descargarArchivo(this.impresionService.imprimirFacturaElectronicas(envi), "exportar_facturas_manualmente" + '.json');
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

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  descartarDocumentos() {
    let res1: any = {
      status: "descartar",
      mensaje: "Descartado"
    }
    for (let docu of this.documentosSelectEnviar) {

      this.insertarEstado(res1, docu);
    }
    $('#descartarModal').modal('hide');
    
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
            this.getDocumentos();
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

  detalleDocumento(documento: DocumentoModel) {
    this.documentoDetalleService.getDocumentoDetalleByDocumento(documento.documento_id).subscribe(res => {
      this.itemsFactura = res;
      console.log("detalles encontrados:" + res.length);
    });
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
    if (res.status == "descartar") {
      documentoInvoice.mensaje = res.mensaje;
      documentoInvoice.invoice_id = this.INVOICE_DESCARTAR;
      docu.invoice_id = this.INVOICE_DESCARTAR;
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
      this.getDocumentos();
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



  validarEnviar() {
    if (this.documentosSelectEnviar.length == 0) {
      alert("Debe seleccionar almenos 1 documento para ser enviado");
      return;
    }
    $('#envioModal').modal('show');
  }

  validarDescartar() {
    if (this.documentosSelectEnviar.length == 0) {
      alert("Debe seleccionar almenos 1 documento para ser descartado");
      return;
    }
    $('#descartarModal').modal('show');
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


  getDocumentos() {
    let tipoDocumento: Array<string> = ['10', '12', '13'];
    this.documentoMap = [];
    this.documentoService.getDocumentoForFacturacionElectronica("", "", tipoDocumento, "", "", this.INVOICE_SIN_ENVIAR, this.empresaId).subscribe(res => {
      this.documentos = res;
    });
  }

  formatearNumber(number: number) {
    let formato: string = "";
    formato = new Intl.NumberFormat().format(number);
    return formato;
  }

  nombreClienteFun(id) {
    let cliente = this.clientes.find(cliente => cliente.cliente_id == id);
    if (cliente == undefined) {
      return "";
    } else {
      return cliente.nombre + " " + cliente.apellidos;
    }
  }

  nombreTipoDocumentoFun(id) {
    let tipoDo = this.tiposDocumento.find(cliente => cliente.tipo_documento_id == id);
    if (tipoDo == undefined) {
      return "";
    } else {
      return tipoDo.nombre;
    }
  }

  getclientes(empresaId: number) {
    this.clienteService.getClientesByEmpresa(empresaId.toString()).subscribe(res => {
      this.clientes = res;
      console.log("lista de clientes cargados: " + this.clientes.length);
    });
  }

  getTiposDocumento() {
    this.documentoService.getTiposDocumento().subscribe(res => {
      this.tiposDocumento = res;
    });
  }

  getConfiguracion(empresaId: number) {
    this.clienteService.getConfiguracionByEmpresa(empresaId.toString()).subscribe(res => {
      this.configuracion = res[0];
    });
  }



}
