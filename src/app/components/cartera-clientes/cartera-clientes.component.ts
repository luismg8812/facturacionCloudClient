import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AbonoModel } from 'src/app/model/abono.model';
import { ClienteModel } from 'src/app/model/cliente.model';
import { DocumentoModel } from 'src/app/model/documento.model';
import { DocumentoDetalleModel } from 'src/app/model/documentoDetalle.model';
import { EmpresaModel } from 'src/app/model/empresa.model';
import { TipoPagoModel } from 'src/app/model/tipoPago.model';
import { AbonoService } from 'src/app/services/abono.service';
import { CalculosService } from 'src/app/services/calculos.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { DocumentoDetalleService } from 'src/app/services/documento-detalle.service';
import { DocumentoService } from 'src/app/services/documento.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ImpresionService } from 'src/app/services/impresion.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-cartera-clientes',
  templateUrl: './cartera-clientes.component.html',
  styleUrls: ['./cartera-clientes.component.css']
})
export class CarteraClientesComponent implements OnInit {

  public clientes: Array<ClienteModel>;
  public empresaId: number;
  public usuarioId: number;
  public cartera: any;
  public abonoNew: AbonoModel = new AbonoModel();
  public abonosDetalle: Array<AbonoModel> = [];
  public itemsFactura: Array<DocumentoDetalleModel> = [];
  public empresa: EmpresaModel;
  public logoEmpresa: string;
  @ViewChild("downloadZipLink") downloadZipLink: ElementRef;

  public documentoSelect: DocumentoModel = new DocumentoModel();
  public tipoPagosAll: Array<TipoPagoModel>;

  constructor(public clienteService: ClienteService,
    public abonoService: AbonoService,
    public documentoDetalleService: DocumentoDetalleService,
    public empresaService:EmpresaService,
    public calculosService:CalculosService,
    public impresionService:ImpresionService,
    public documentoService: DocumentoService) { }

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.usuarioId = Number(localStorage.getItem("usuario_id"));
    this.getclientes(this.empresaId);
    this.getTipoPago();
    this.getEmpresa();
  }

  detalleAbonos(documento) {
    this.abonoService.getAbonosByDocumento(documento.documento_id).subscribe(async res => {
      this.abonosDetalle = res;
    });
    this.selectDocumento(documento);
  }

  imprimirInforme(documento) {
    this.abonoService.getAbonosByDocumento(documento.documento_id).subscribe(async abonos => {
      let cliente = this.clientes.find(client => client.cliente_id == documento.cliente_id);   
      let formato = ".txt";
      let tituloDocumento: string = "soporte_abonos"+formato;
      this.descargarArchivo(this.impresionService.imprimirAbonosCliente(this.empresa,  tituloDocumento,documento,cliente, abonos),tituloDocumento);
    });
    this.selectDocumento(documento);
  } 

  nombreClienteFun(id) {

    let cliente = this.clientes.find(cliente => cliente.cliente_id == id);
    if (cliente == undefined) {
      return ""; 
    } else {
      return cliente.nombre+" "+cliente.apellidos+" "+cliente.razon_social;
    }
  }

  closeModal() {
    $('#detalleDocumentoModal').modal('hide');
  }

  crearAbono() {
    let valido: boolean = true;
    let mensageError: string = "Son obligatorios:\n ";
    if (this.abonoNew.tipo_pago_id == "") {
      mensageError += "Tipo de pago\n";
      valido = false;
    }
    if (this.abonoNew.cantidad.toString() == "") {
      mensageError += "Valor Abono\n";
      valido = false;
    }
    if (valido == false) {
      alert(mensageError);
      return;
    }
    if ((this.documentoSelect.saldo - this.abonoNew.cantidad) < 0) {
      alert("El valor del abono supera el saldo");
      return;
    }
    if(this.abonoNew.cantidad < 0){
      alert("El valor del abono no puede ser negativo");
      return;
    }
    let saldo = Number(this.documentoSelect.saldo) - Number(this.abonoNew.cantidad);
    this.documentoSelect.saldo = saldo;
    this.abonoNew.documento_id = this.documentoSelect.documento_id;
    this.abonoNew.usuario_id = this.usuarioId;
    this.abonoService.saveAbono(this.abonoNew).subscribe(async res => {
      if (res.code == 200) {
        this.documentoService.updateDocumento(this.documentoSelect).subscribe(async res => { });
        $('#crearAbonoModal').modal('hide');
      } else {
        alert("error intentando crear abono");
      }
    });
  }



  selectDocumento(documento) {
    this.documentoService.getByDocumentoId(documento.documento_id).subscribe(async res => { 
      this.documentoSelect = res[0];
    });
    
  }

  exportTableToExcel() {
    let filename = "reporte_cartera";
    var dataType = 'application/vnd.ms-excel';
    var texto = [];
    let tamanoMax: number = 40;
    texto.push("fecha registro;Cliente;N. interno;Consecutivo DIAN;Valor Factura;Valor Credito;Saldo\n");
    for (let p of this.cartera) {
      texto.push(p.fecha_registro + ";" + this.nombreClienteFun( p.cliente_id) + ";" + p.documento_id + ";" + p.consecutivo_dian + ";" + p.total + ";" + p.valor + ";" + p.saldo+'\n');
    }
    // Specify file name
    filename = filename ? filename + '.csv' : 'reporte_cartera.csv';
    var blob = new Blob(texto, {
      type: dataType
    });
    this.descargarArchivo(blob, filename)

  }

  descargarArchivo(contenidoEnBlob, nombreArchivo) {
    const url = window.URL.createObjectURL(contenidoEnBlob);
    const link = this.downloadZipLink.nativeElement;
    link.href = url;
    link.download = nombreArchivo;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  buscar(cliete, fechaIni, fechaFin) {
    console.log(cliete.value);
    let cliente1 = this.clientes.find(cliente => (cliente.nombre+' '+cliente.apellidos+' - '+cliente.documento) == cliete.value);   
    console.log(cliente1);
    let id= (cliente1==undefined?"":cliente1.cliente_id);
    this.documentoService.getCarteraClientes(id, "",fechaIni.value, fechaFin.value, this.empresaId,10).subscribe(res => {
      console.log(res);
      this.cartera = res;
    });
  }

  getclientes(empresaId: number) {
    this.clienteService.getClientesByEmpresa(empresaId.toString()).subscribe(res => {
      this.clientes = res;
      console.log("lista de clientes cargados: " + this.clientes.length);
    });
  }

  formatearNumber(number: number) {
    let formato: string = "";
    formato = new Intl.NumberFormat().format(number);
    return formato;
  }

  getTipoPago() {
    this.clienteService.getTipoPago().subscribe(res => {
      this.tipoPagosAll = res;
    });
  }

  nombreTipoPago(id) {
    let tipo = this.tipoPagosAll.find(tipos => tipos.tipo_pago_id == id);
    if (tipo == undefined) {
      return "";
    } else {
      return tipo.nombre;
    }
  }

  detalleDocumento(documento: DocumentoModel) {
    this.documentoSelect = documento;
    this.documentoDetalleService.getDocumentoDetalleByDocumento(documento.documento_id).subscribe(res => {
      this.itemsFactura = res;
      console.log("detalles encontrados:" + res.length);
    });
  }

  getEmpresa() {
    this.empresaService.getEmpresaById(this.empresaId.toString()).subscribe(res => {
      this.empresa = res[0];
      this.getLogoEmpresa(this.empresa.url_logo);
    });
  }

  getLogoEmpresa(imgData: string) {
    this.calculosService.getBase64ImageFromURL(imgData).subscribe(base64data => {
      this.logoEmpresa = 'data:image/jpg;base64,' + base64data;
    });
  }

}
