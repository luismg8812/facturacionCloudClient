import { Component, OnInit } from '@angular/core';
import { ClaseModel } from '../model.contabilidad/clase.model';
import { CuentasContablesService } from '../services/cuentas-contables.service';

@Component({
  selector: 'app-cuentas-contables',
  templateUrl: './cuentas-contables.component.html',
  styleUrls: ['./cuentas-contables.component.css']
})
export class CuentasContablesComponent implements OnInit {

  public rows:any[]=[];
  public clases:ClaseModel[]=[];
  public empresaId: number;

  constructor(public cuentasContablesService:CuentasContablesService) { }

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.getClases(this.empresaId);
  }

  getClases(empresaId:number){
    this.cuentasContablesService.getClasesContables(empresaId).subscribe(res => {
      this.clases = res;
      console.log("lista de clases cargadas: " + this.clases.length);
    });
  }

}
