import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbonoModel } from '../model/abono.model';
import { DocumentoModel } from '../model/documento.model';
import { ProveedorModel } from '../model/proveedor.model';
import { TipoPagoModel } from '../model/tipoPago.model';
import { AbonoService } from '../services/abono.service';
import { ClienteService } from '../services/cliente.service';
import { DocumentoService } from '../services/documento.service';
import { ProveedorService } from '../services/proveedor.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-cartera-proveedores',
  templateUrl: './cartera-proveedores.component.html',
  styleUrls: ['./cartera-proveedores.component.css']
})
export class CarteraProveedoresComponent implements OnInit {

  public empresaId: number;
  public proveedores: Array<ProveedorModel>;
  public cartera: any;
  public usuarioId: number;
  public tipoPagosAll: Array<TipoPagoModel>;
  public abonoNew: AbonoModel = new AbonoModel();
  public documentoSelect: DocumentoModel = new DocumentoModel();
  public abonosDetalle: Array<AbonoModel> = [];

  @ViewChild("downloadZipLink") downloadZipLink: ElementRef;

  constructor(public proveedorService:ProveedorService,
    public clienteService:ClienteService,
    public abonoService:AbonoService,
    public documentoService:DocumentoService) { }

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.usuarioId = Number(localStorage.getItem("usuario_id"));
    this.getProveedores(this.empresaId);
    this.getTipoPago() ;

  }

  buscar(cliete, fechaIni, fechaFin) {
    console.log(cliete.value);
    let cliente1 = this.proveedores.find(cliente => (cliente.nombre+' '+cliente.apellidos+' - '+cliente.documento) == cliete.value);   
    console.log(cliente1);
    let id= (cliente1==undefined?"":cliente1.proveedor_id);
    this.documentoService.getCarteraClientes("",id, fechaIni.value, fechaFin.value, this.empresaId,2).subscribe(res => {
      console.log(res);
      this.cartera = res;
    });
  }

  crearDocumento(){
    
  }

  exportTableToExcel() {
    let filename = "reporte_cartera";
    var dataType = 'application/vnd.ms-excel';
    var texto = [];
    let tamanoMax: number = 40;
    texto.push("fecha registro;Cliente;N. interno;Consecutivo DIAN;Valor Factura;Valor Credito;Saldo\n");
    for (let p of this.cartera) {
      texto.push(p.fecha_registro + ";" + this.nombreProveedorFun( p.proveedor_id) + ";" + p.documento_id + ";" + p.consecutivo_dian + ";" + p.total + ";" + p.valor + ";" + p.saldo+'\n');
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

  nombreTipoPago(id) {
    let tipo = this.tipoPagosAll.find(tipos => tipos.tipo_pago_id == id);
    if (tipo == undefined) {
      return "";
    } else {
      return tipo.nombre;
    }
  }

  detalleAbonos(documento) {
    this.abonoService.getAbonosByDocumento(documento.documento_id).subscribe(async res => {
      this.abonosDetalle = res;
    });
    this.selectDocumento(documento);
  }

  selectDocumento(documento) {
    this.documentoService.getByDocumentoId(documento.documento_id).subscribe(async res => { 
      this.documentoSelect = res[0];
    });
    
  }

  nombreProveedorFun(id) {

    let cliente = this.proveedores.find(cliente => cliente.proveedor_id == id);
    if (cliente == undefined) {
      return ""; 
    } else {
      return cliente.nombre;
    }
  }

  getProveedores(empresaId: number) {
    this.proveedorService.getProveedoresByEmpresa(empresaId.toString()).subscribe(res => {
      this.proveedores = res;
      console.log("lista de proveedores cargados: " + this.proveedores.length);
    });
  }

  getTipoPago() {
    this.clienteService.getTipoPago().subscribe(res => {
      this.tipoPagosAll = res;
    });
  }

  formatearNumber(number: number) {
    let formato: string = "";
    formato = new Intl.NumberFormat().format(number);
    return formato;
  }

}
