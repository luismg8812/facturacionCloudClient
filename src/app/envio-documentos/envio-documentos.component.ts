import { Component, OnInit } from '@angular/core';
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
  public enviado: EnvioFacturacionElectronicaModel;
  public empresaId: number;
  public clientes: Array<ClienteModel>;

  constructor(public documentoService: DocumentoService,
    public calculosService: CalculosService,
    public empresaService: EmpresaService,
    public documentoDetalleService: DocumentoDetalleService,
    public facturacionElectronicaService: FacturacionElectronicaService,
    public clienteService: ClienteService) { }

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.getclientes(this.empresaId);
    this.getDocumentos();

  }

  enviarDocumentos() {
    this.empresaService.getEmpresaById(this.empresaId.toString()).subscribe(empr => {
      this.crearOjb(empr[0]);
      this.facturacionElectronicaService.enviarFactura(this.enviado).subscribe(res1 => {
        console.log(res1);
        alert('Todos los documentos seleccionados fueron enviados, por favor ir a "Consultar estado de documentos" para ver el estado de los documentos.');
        $('#envioModal').modal('hide');
      });
    },error=>{
      console.error(error);
      alert("Ocurrio un error con el proceso de envios de sus documentos a la DIAN, por favor comuniquese a los siguientes canales a soporte:\nCelular: 3185222474\n"+
      "mail: info@effectivesoftware.com.co\n"+
      "Error: "+error.error
      )
      $('#envioModal').modal('hide');
    });
  }

  private crearOjb(empresa: EmpresaModel) {
    this.enviado = new EnvioFacturacionElectronicaModel();
    this.enviado.key = "$argon2i$v=19$m=65536,t=4,p=1$T3NhZ21ET0RmUkc1dUtpcQ$IH1TserbS5U0CmivYKJWjEaBue86G3CpLWEKroxnxtY";
    this.enviado.datajson = this.asignarDataJson(empresa);
  }

  private asignarDataJson(empresa: EmpresaModel) {
    let dataJson: DataJSONModel = new DataJSONModel();
    dataJson.nitEmpresa = empresa.nit;
    dataJson.facturas = this.asignarFacturas();
    return dataJson;
  }

  private asignarFacturas() {
    let facturas: Array<FacturasModel> = [];
    for (let docu of this.documentoMap) {
      let factura: FacturasModel = new FacturasModel();
      factura.dataCliente = this.asignarDataCliente(docu);
      factura.dataFactura = this.asignarDataFactura(docu);
      factura.dataFacturaTotales=this.dataFacturaTotales(docu);
      factura.dataImpuestos= this.asignarDataImpuestosFactura(docu);
      factura.dataDetalleFactura=this.asignarDetalles(docu);
      facturas.unshift(factura);
    }
    return facturas;
  }

  asignarDetalles(docu: DocumentoMapModel){
    let dataDetalleFactura:Array<DataDetalleFacturaModel>=[];
    for(let detalle of docu.documentoDetalle){
      let impuesto:number=Number(detalle.impuesto_producto)/100;
      let datadetalle:DataDetalleFacturaModel=new DataDetalleFacturaModel();
      datadetalle.cantidad=""+detalle.cantidad;
      datadetalle.codigoProducto=""+detalle.producto_id;
      datadetalle.nombreProducto=detalle.descripcion;
      datadetalle.precio=""+detalle.unitario;
      datadetalle.subtotal=""+detalle.parcial;
      datadetalle.impuestos=this.dataDataImpuestosDetalle(detalle);
      datadetalle.descuentos=this.dataDescuentosDetalle(detalle);
      datadetalle.totalDescuentos="0"// agregar descuetos al detalle
      datadetalle.totalImpuestos=""+(detalle.parcial/(1+impuesto))*impuesto;
      dataDetalleFactura.unshift(datadetalle);
    }
    return dataDetalleFactura;
  }

  dataDescuentosDetalle(detalle:DocumentoDetalleModel){
    let datadescuentos:Array<DataDescuentosModel>=[];
    let datadescuento:DataDescuentosModel=new DataDescuentosModel();
    datadescuento.allowance_charge_reason="DESCUENTO GENERAL";
    datadescuento.amount="0";
    datadescuento.base_amount="0";
    datadescuento.charge_indicator="false";
    datadescuento.multiplier_factor_numeric="0"
    datadescuentos.unshift(datadescuento);
    return datadescuentos;
  }

  dataDataImpuestosDetalle(detalle:DocumentoDetalleModel){
    let impuesto:number=Number(detalle.impuesto_producto)/100;
    let dataImpuestos:Array<DataImpuestosModel>=[];
    let iva:DataImpuestosModel=new DataImpuestosModel();
    iva.codigoImpuesto="01";
    iva.nombreImpuesto="IVA";
    iva.porcentajeImpuesto=""+detalle.impuesto_producto;
    iva.valorImpuestoCalculado=""+(detalle.parcial/(1+impuesto))*impuesto;
    dataImpuestos.unshift(iva);
    return dataImpuestos;
  }

  asignarDataImpuestosFactura(docu: DocumentoMapModel){
    let dataImpuestos:Array<DataImpuestosModel>=[];
    let iva5:DataImpuestosModel=new DataImpuestosModel();
    let iva19:DataImpuestosModel=new DataImpuestosModel();
    let exento:DataImpuestosModel=new DataImpuestosModel();
    iva5.codigoImpuesto="01";
    iva5.nombreImpuesto="IVA";
    iva5.porcentajeImpuesto="5.00";
    iva5.valorImpuestoCalculado=""+docu.documento.iva_5;
    dataImpuestos.unshift(iva5);

    iva19.codigoImpuesto="01";
    iva19.nombreImpuesto="IVA";
    iva19.porcentajeImpuesto="19.00";
    iva19.valorImpuestoCalculado=""+docu.documento.iva_19;
    dataImpuestos.unshift(iva19);

    exento.codigoImpuesto="01";
    exento.nombreImpuesto="IVA";
    exento.porcentajeImpuesto="0.00";
    exento.valorImpuestoCalculado=""+docu.documento.excento;
    dataImpuestos.unshift(exento);
    return dataImpuestos;
  }

  dataFacturaTotales(docu: DocumentoMapModel){
 let dataFacturaTotales:DataFacturaTotalesModel=new DataFacturaTotalesModel();
 dataFacturaTotales.descuentos=""+docu.documento.descuento;
 dataFacturaTotales.subtotal=""+docu.documento.total;
 dataFacturaTotales.totalApagar=""+docu.documento.total;
 dataFacturaTotales.totalImpuestos=""+docu.documento.iva;
return dataFacturaTotales;
  }

  asignarDataFactura(docu: DocumentoMapModel) {
    let dataFactura: DataFacturaModel = new DataFacturaModel();
    dataFactura.codigoFactura = docu.documento.consecutivo_dian;
      dataFactura.sssueDate = this.calculosService.formatDate(docu.documento.fecha_registro, false);
      dataFactura.issueTime = this.calculosService.formatTime(docu.documento.fecha_registro);
      dataFactura.invoiceTypeCode = "01";
      dataFactura.metodoDePago = "1";
      dataFactura.formaDePago = "10";
      dataFactura.paymentDueDate = "0000-00-00";
      return dataFactura;
  }

  asignarDataCliente(docu: DocumentoMapModel) {
    let datacliente: DataClienteModel = new DataClienteModel();
    let cliente = this.clientes.find(client => client.cliente_id === docu.documento.cliente_id);
    datacliente.additionalAccountIDCliente = "" + cliente.cliente_id;
    datacliente.codigoTipoIdentificacionCliete = "13"; //TO DO cambiar por los valores que de ever
    datacliente.identificacionCliente = cliente.documento;
    datacliente.nombreCliente = cliente.nombre + " " + cliente.segundo_nombre + " " + cliente.apellidos + " " + cliente.segundo_apellido;
    datacliente.codigoMunicipioCliente = "11001";
    datacliente.direccionCliente = cliente.direccion;
    datacliente.telefonoCliente = cliente.celular;
    datacliente.emailCliente = cliente.mail;
    return datacliente;
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
    } else {
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
    let tipoDocumento = '10';
    this.documentoService.getDocumentoByTipoAndFecha(tipoDocumento, "", "", "", "", "", "", "", "", this.empresaId).subscribe(res => {
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
      return cliente.nombre;
    }
  }

  getclientes(empresaId: number) {
    this.clienteService.getClientesByEmpresa(empresaId.toString()).subscribe(res => {
      this.clientes = res;
      console.log("lista de clientes cargados: " + this.clientes.length);
    });
  }



}
