import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TipoDocumentoModel } from 'src/app/model/tipoDocumento.model';
import { CalculosService } from 'src/app/services/calculos.service';
import { DocumentoService } from 'src/app/services/documento.service';

@Component({
  selector: 'app-reporte-terceros',
  templateUrl: './reporte-terceros.component.html',
  styleUrls: ['./reporte-terceros.component.css']
})
export class ReporteTercerosComponent implements OnInit {

  constructor(public calculosService:CalculosService,
    public documentoService:DocumentoService) { }

  public total: number = 0;
  public gravable_5: number = 0;
  public gravable_19: number = 0;
  public iva_5: number = 0;
  public iva_19: number = 0;
  public exento: number = 0;
  public empresaId: number;
  public terceros:any[];
  public tiposDocumento: Array<TipoDocumentoModel>;

  @ViewChild("fechaIni") fechaIni: ElementRef;
  @ViewChild("fechaFin") fechaFin: ElementRef;
  @ViewChild("montoDesde") montoDesde: ElementRef;
  @ViewChild("montoHasta") montoHasta: ElementRef;
  @ViewChild("tipoDocumento") tipoDocumento: ElementRef;
  @ViewChild("tipoTercero") tipoTercero: ElementRef;
  @ViewChild("downloadZipLink") downloadZipLink: ElementRef;
  
  
  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.getTiposDocumento();
  }

  calcular() {
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
    this.documentoService.getTerceros(ini, fin,
      this.tipoTercero.nativeElement.value, this.tipoDocumento.nativeElement.value,
      this.montoDesde.nativeElement.value, this.empresaId, this.montoHasta.nativeElement.value
    ).subscribe(res => {
      this.terceros = res;
      for (let dia of this.terceros) {
        this.total = Number(this.total) + Number(dia.total);
        this.gravable_5 = Number(this.gravable_5) + Number(dia.base_5);
        this.gravable_19 = Number(this.gravable_19) + Number(dia.base_19);
        this.iva_5 = Number(this.iva_5) + Number(dia.iva_5);
        this.iva_19 = Number(this.iva_19) + Number(dia.iva_19);
        this.exento = Number(this.exento) + Number(dia.exento);
      }
    });
  }

  exportTableToExcel() {
    let filename = "terceros";
    var dataType = 'application/vnd.ms-excel';
    var texto = [];
    texto.push("Nombre;Identificación;Total;Gravable 19;gravable 5;IVA 19;IVA 5;Exento\n");
    for (let p of this.terceros) {
      texto.push(p.nombre + ";" + p.documento + ";" + p.total + ";" + p.base_19 + ";" + p.base_5 + ";" + p.iva_19 + ";" + p.iva_5 + ";" + p.exento + '\n');
    }
    // Specify file name
    filename = filename ? filename + '.csv' : 'excel_data.csv';
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

  getTiposDocumento() {
    this.documentoService.getTiposDocumento().subscribe(res => {
      this.tiposDocumento = res;
    });
  }


  formatearNumber(number: number) {
    let formato: string = "";
    formato = new Intl.NumberFormat().format(number);
    return formato;
  }

}
