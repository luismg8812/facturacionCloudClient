import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ClienteModel } from 'src/app/model/cliente.model';
import { DocumentoModel } from 'src/app/model/documento.model';
import { EmpresaModel } from 'src/app/model/empresa.model';
import { InformeDiarioModel } from 'src/app/model/informeDiario.model';
import { InformeDiarioVOModel } from 'src/app/model/informeDiarioVO.model';
import { CalculosService } from 'src/app/services/calculos.service';
import { CierreService } from 'src/app/services/cierre.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { DocumentoService } from 'src/app/services/documento.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ImpresionService } from 'src/app/services/impresion.service';


@Component({
  selector: 'app-informe-diario',
  templateUrl: './informe-diario.component.html',
  styleUrls: ['./informe-diario.component.css']
})
export class InformeDiarioComponent implements OnInit {

  @ViewChild("fechaIni") fechaIni: ElementRef;
  @ViewChild("fechaFin") fechaFin: ElementRef;
  @ViewChild("downloadZipLink") downloadZipLink: ElementRef;
  public dias: Array<any>;
  public empresaId: number;
  public total: number = 0;
  public gravable_5: number = 0;
  public gravable_19: number = 0;
  public iva_5: number = 0;
  public iva_19: number = 0;
  public exento: number = 0;
  public grupos: any;
  public subGrupos: any;
  public detalles: Array<DocumentoModel>;
  public clientes: Array<ClienteModel> = [];
  public empresa: EmpresaModel;


  constructor(public cierreService: CierreService,
    public impresionService: ImpresionService,
    public empresaService: EmpresaService,
    public documentoService: DocumentoService,
    public calculosService: CalculosService,
    public clienteService:ClienteService
  ) { }

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.getInformeDiario();
    this.getclientes(this.empresaId);
    this.getEmpresa();
  }

  ventaGrupos() {
    let ini: string = this.fechaIni.nativeElement.value;
    let fin: string = this.fechaFin.nativeElement.value;
    if (ini != '' && fin != '') {

      ini = this.calculosService.fechaIniBusqueda(this.fechaIni.nativeElement.value);
      fin = this.calculosService.fechaFinBusqueda(this.fechaFin.nativeElement.value);
      console.log(ini);
    } else {
      let date: Date = new Date();
      date.setDate(1);
      ini = date.toLocaleString();
      date.setDate(30);
      fin = date.toLocaleString();
    }
    this.documentoService.getVentasPorGrupos("", ini, fin, false).subscribe(res => {
      console.log(res);
      this.grupos = res;
    });
    this.documentoService.getVentasPorSubGrupos("", ini, fin, false).subscribe(res => {
      console.log(res);
      this.subGrupos = res;
    });
  }




  imprimirInforme(informe: any) {
    let informeDiario: InformeDiarioVOModel = new InformeDiarioVOModel();
    informeDiario.informe_diario = informe;
    let fechaInicial:string=this.calculosService.fechaIniBusquedaDate( informe.fecha);
    let fechaFinal:string=this.calculosService.fechaFinBusquedaDate( informe.fecha);
    this.documentoService.getDocumentosByFechaAndTipoDetalle(fechaInicial, fechaFinal,"", "","", this.empresaId).subscribe(res => {
      informeDiario.empresa = this.empresa;
      informeDiario.detalle=res;
      let tituloDocumento = "informe_diario_" + this.calculosService.formatDate(informe.fecha, false) + "_" + informeDiario.empresa.nombre
      informeDiario.tituloArchivo = tituloDocumento;
      this.impresionService.imprimirInformeDiarioPDFCarta(informeDiario);
    });
  }

  formatearNumber(number: number) {
    let formato: string = "";
    formato = new Intl.NumberFormat().format(number);
    return formato;
  }

  getInformeDiario() {
    this.total = 0;
    this.gravable_5 = 0;
    this.gravable_19 = 0;
    this.iva_5 = 0;
    this.iva_19 = 0;
    this.exento = 0;
    let ini: string = this.fechaIni.nativeElement.value;
    let fin: string = this.fechaFin.nativeElement.value;
    if (ini != '' && fin != '') {
      ini = this.calculosService.fechaIniBusqueda(this.fechaIni.nativeElement.value);
      fin = this.calculosService.fechaFinBusqueda(this.fechaFin.nativeElement.value);
    } else {
      let date: Date = new Date();
      date.setDate(1);
      ini = date.toLocaleString();
      date.setDate(30);
      fin = date.toLocaleString();
    }
    this.documentoService.getDocumentosByFechaAndTipo(ini, fin,"", "","", this.empresaId).subscribe(res => {
      this.dias = res;
      for (let dia of this.dias) {
        this.total = Number(this.total) + Number(dia.total);
        this.gravable_5 = Number(this.gravable_5) + Number(dia.base_5);
        this.gravable_19 = Number(this.gravable_19) + Number(dia.base_19);
        this.iva_5 = Number(this.iva_5) + Number(dia.iva_5);
        this.iva_19 = Number(this.iva_19) + Number(dia.iva_19);
        this.exento = Number(this.exento) + Number(dia.excento);
      }
    });
  }

  cargarDetalle(detalle){
    let fechaInicial:string=this.calculosService.fechaIniBusquedaDate( detalle.fecha);
    let fechaFinal:string=this.calculosService.fechaFinBusquedaDate( detalle.fecha);
 console.log(fechaInicial);
 console.log(fechaFinal);
    this.documentoService.getDocumentosByFechaAndTipoDetalle(fechaInicial, fechaFinal,
      "", "",
      "", this.empresaId
    ).subscribe(res => {
      this.detalles = res;
      
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

  nombreClienteFun(id) {

    let cliente = this.clientes.find(cliente => cliente.cliente_id == id);
    if (cliente == undefined) {
      return "";
    } else {
      return cliente.nombre+" "+cliente.apellidos+" "+cliente.razon_social;
    }
  }  

  getclientes(empresaId: number) {
    this.clienteService.getClientesByEmpresa(empresaId.toString()).subscribe(res => {
      this.clientes = res;
      console.log("lista de clientes cargados: " + this.clientes.length);
    });
  }

  getEmpresa() {
    this.empresaService.getEmpresaById(this.empresaId.toString()).subscribe(res => {
      this.empresa = res[0];
    });
  }

}
