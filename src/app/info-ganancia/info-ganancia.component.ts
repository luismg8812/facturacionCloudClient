import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DocumentoService } from '../services/documento.service';
import { CalculosService } from '../services/calculos.service';

@Component({
  selector: 'app-info-ganancia',
  templateUrl: './info-ganancia.component.html',
  styleUrls: ['./info-ganancia.component.css']
})
export class InfoGananciaComponent implements OnInit {

  public empresaId: number;
  public totalVentas:number=0;
  public totalVentasCostos:number=0;
  public totalRemisiones:number=0;
  public totalCostosRemisiones:number=0;
  public totalIva5:number=0;
  public totalIva19:number=0;
  public totalExento:number=0;
  public gananciaVentas:number=0;
  public gananciaRemisiones:number=0;
  public gananciaTotal:number=0;
  public grupos:any;
  @ViewChild("fechaIni") fechaIni: ElementRef;
  @ViewChild("fechaFin") fechaFin: ElementRef;

  constructor(public documentoService: DocumentoService,
    public calculosService: CalculosService) { }

    calcular() {
   
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
      this.documentoService.getGananciaDocumentos(ini, fin,this.empresaId).subscribe(res => {
        console.log(res) 
        this.totalVentas = res[0].total_ventas;
        this. totalVentasCostos= res[0].total_costos_ventas
        this. totalRemisiones= res[0].total_remisiones
        this. totalCostosRemisiones= res[0].total_costos_remisiones
        this. totalIva5= res[0].iva_5
        this. totalIva19= res[0].iva_19
        this. totalExento= res[0].excento
        this. gananciaVentas= res[0].ganancias_ventas
        this. gananciaRemisiones= res[0].ganancias_remisiones
        this. gananciaTotal= Number(this.gananciaRemisiones)+Number(this.gananciaVentas);
      });
      this.ventaGrupos(ini,fin);
    }

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
  }

  ventaGrupos(fechaIni,fechaFin) {
    this.documentoService.getVentasPorGrupos("",fechaIni,fechaFin,false).subscribe(res => {
      console.log(res);
      this.grupos = res;
    });

  }

  formatearNumber(number: number) {
    let formato: string = "";
    formato = new Intl.NumberFormat().format(number);
    return formato;
  }

 

}
