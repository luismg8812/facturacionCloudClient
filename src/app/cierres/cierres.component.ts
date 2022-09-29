import { Component, OnInit } from '@angular/core';
import { DocumentoModel } from '../model/documento.model';
import { CierreService } from '../services/cierre.service';
import { DocumentoService } from '../services/documento.service';
declare var jquery: any;
declare var $: any;


@Component({
  selector: 'app-cierres',
  templateUrl: './cierres.component.html',
  styleUrls: ['./cierres.component.css']
})
export class CierresComponent implements OnInit {

  public infoDiario: any;
  public infoMensual: any;
  public empresaId: number;

  public ordenesBuscarList: Array<DocumentoModel> = [];

  readonly TIPO_DOCUMENTO_ORDEN_TRABAJO: number = 11;

  constructor(public cierreService:CierreService,
    public documentoService: DocumentoService) { }

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.getCierreDiario(this.empresaId);
    this.getCierreMensual(this.empresaId);
    this.getOrdenesCero();
  }

  getCierreDiario(empresaId:number){
    this.cierreService.getCierreDiario(empresaId).subscribe((res) => { 
      this.infoDiario=res[0];
    });
  }

  getCierreMensual(empresaId:number){
    //this.cierreService.getCierreDiario(empresaId).subscribe((res) => { 
     // this.infoDiario=res[0];
    //});
  }

  formatearNumber(number: number) {
    let formato: string = "";
    formato = new Intl.NumberFormat().format(number);
    return formato;
  }

  cierreDiario1(){

  }

  cierreMensual(){
    
  }

  cierreDiario(){
    this.cierreService.hacerCierreDiario(this.empresaId).subscribe(res => {
      if (res.code != 200) {
        alert("error actualizando el documento, por favor inicie nuevamente la acción");
        return;
      }else{
        $('#confirmarCierreDiarioModal').modal('hide');
        this.getCierreDiario(this.empresaId);
      }
    });
  }

  getOrdenesCero(){
    let tipoDocumentoId = this.TIPO_DOCUMENTO_ORDEN_TRABAJO;
    this.documentoService.getOrdenesTrabajoEn0(this.empresaId,  tipoDocumentoId).subscribe(res => {
      this.ordenesBuscarList = res;
    });
    
  }

  borrarOrdenesEn0(){
    let ordenes: string[] = [];
    
    for(let or of this.ordenesBuscarList){
      let bandera=0;
      console.log(or.descripcion_cliente.length);
      if(or.detalle_entrada.length!=0){
        bandera=1
      }
      
        if(or.descripcion_cliente.length!=0){
          bandera=1
        }
        if(bandera==0){   
          ordenes.push(or.documento_id); 
    
        }
     
    }

    if(ordenes.length==0){
        alert("No hay ordenes vacías para borrar");
        $('#borrarOrdenes0').modal('hide');
    }else{
      this.documentoService.borrarOrdenesEn0(ordenes).subscribe(res => {
        $('#borrarOrdenes0').modal('hide');
       });
    }
    
    
  }

}
