import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InformeDiarioModel } from '../model/informeDiario.model';
import { CierreService } from '../services/cierre.service';
import { CalculosService } from '../services/calculos.service';
import { InformeDiarioVOModel } from '../model/informeDiarioVO.model';
import { ImpresionService } from '../services/impresion.service';
import { EmpresaService } from '../services/empresa.service';

@Component({
  selector: 'app-informe-diario',
  templateUrl: './informe-diario.component.html',
  styleUrls: ['./informe-diario.component.css']
})
export class InformeDiarioComponent implements OnInit {

  @ViewChild("fechaIni") fechaIni: ElementRef;
  @ViewChild("fechaFin") fechaFin: ElementRef;
  @ViewChild("downloadZipLink") downloadZipLink: ElementRef;
  public informesDiarios:Array<InformeDiarioModel>=[];
  public empresaId: number;
  public total:number=0;
  public gravable_5:number=0;
  public gravable_19:number=0;
  public iva_5:number=0;
  public iva_19:number=0;
  public exento:number=0;
  

  constructor(public cierreService:CierreService,
    public impresionService: ImpresionService,
    public empresaService: EmpresaService,
    public calculosService: CalculosService
    ) { }

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.getInformeDiario();
  }

  imprimirInforme(informe:InformeDiarioModel) {
    let informeDiario:InformeDiarioVOModel= new InformeDiarioVOModel();
    informeDiario.informe_diario=informe;
    this.empresaService.getEmpresaById(this.empresaId.toString()).subscribe(res => {
      informeDiario.empresa=res[0];
      let tituloDocumento="informe_diario_"+this.calculosService.formatDate(informeDiario.informe_diario.fecha_informe,false)+"_"+informeDiario.empresa.nombre
      informeDiario.tituloArchivo=tituloDocumento;
      this.impresionService.imprimirInformeDiarioPDFCarta(informeDiario);
    });
  }

  formatearNumber(number: number) { 
    let formato: string = "";
    formato = new Intl.NumberFormat().format(number);
    return formato;
  }

  getInformeDiario(){
    this.total = 0;
    this.gravable_5 = 0;
    this.gravable_19 = 0;
    this.iva_5 = 0;
    this.iva_19 = 0;
    this.exento = 0;
    console.log(this.fechaIni.nativeElement.value);
    let ini: string = this.fechaIni.nativeElement.value;
    let fin: string = this.fechaFin.nativeElement.value;
    if (ini == '' || fin == '') {
      ini=this.calculosService.formatDate(new Date(),false);
      fin=this.calculosService.formatDate(new Date(),false);
    }
    this.cierreService.getInfoDiarioByDate(this.empresaId,ini,fin).subscribe(res => {
    this.informesDiarios=res;
    for(let dia of this.informesDiarios){
      this.total = Number(this.total) + Number(dia.total_ventas);
      this.gravable_5 = Number(this.gravable_5) + Number(dia.base_5);
      this.gravable_19 = Number(this.gravable_19) + Number(dia.base_19);
      this.iva_5 = Number(this.iva_5) + Number(dia.iva_5);
      this.iva_19 = Number(this.iva_19) + Number(dia.iva_19);
      this.exento = Number(this.exento) + Number(dia.excento);
    }
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

}
