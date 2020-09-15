import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ClienteModel } from '../model/cliente.model';
import { ClienteService } from '../services/cliente.service';
import { DocumentoService } from '../services/documento.service';
import { AbonoModel } from '../model/abono.model';
import { DocumentoModel } from '../model/documento.model';
import { TipoPagoModel } from '../model/tipoPago.model';
import { AbonoService } from '../services/abono.service';
import { async } from '@angular/core/testing';
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
  @ViewChild("downloadZipLink") downloadZipLink: ElementRef;

  public documentoSelect: DocumentoModel = new DocumentoModel();
  public tipoPagosAll: Array<TipoPagoModel>;

  constructor(public clienteService: ClienteService,
    public abonoService: AbonoService,
    public documentoService: DocumentoService) { }

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.usuarioId = Number(localStorage.getItem("usuario_id"));
    this.getclientes(this.empresaId);
    this.getTipoPago();
  }

  detalleAbonos(documento) {
    this.abonoService.getAbonosByDocumento(documento.documento_id).subscribe(async res => {
      this.abonosDetalle = res;
    });
    this.selectDocumento(documento);
  }

  imprimirInforme(documento:DocumentoModel) {
    /*let informeDiario:InformeDiarioVOModel= new InformeDiarioVOModel();
    informeDiario.informe_diario=informe;
    this.empresaService.getEmpresaById(this.empresaId.toString()).subscribe(res => {
      informeDiario.empresa=res[0];
      let tituloDocumento="informe_diario_"+this.calculosService.formatDate(informeDiario.informe_diario.fecha_informe,false)+"_"+informeDiario.empresa.nombre
      informeDiario.tituloArchivo=tituloDocumento;
      this.impresionService.imprimirInformeDiarioPDFCarta(informeDiario);
    });*/
  } 

  nombreClienteFun(id) {

    let cliente = this.clientes.find(cliente => cliente.cliente_id == id);
    if (cliente == undefined) {
      return ""; 
    } else {
      return cliente.nombre;
    }
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

}
