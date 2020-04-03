import { Component, OnInit } from '@angular/core';
import { CierreService } from '../services/cierre.service';
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

  constructor(public cierreService:CierreService) { }

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.getCierreDiario(this.empresaId);
    this.getCierreMensual(this.empresaId);
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
        alert("error actualizando el documento, por favor inicie nuevamente la creación del documento");
        return;
      }else{
        $('#confirmarCierreDiarioModal').modal('hide');
        this.getCierreDiario(this.empresaId);
      }
    });
  }

}
