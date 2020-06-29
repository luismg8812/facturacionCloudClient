import { Component, OnInit } from '@angular/core';
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

  buscar(cliete, fechaIni, fechaFin) {
    this.documentoService.getCarteraClientes(cliete.value, fechaIni.value, fechaFin.value, this.empresaId).subscribe(res => {
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
