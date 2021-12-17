import { Component, OnInit } from '@angular/core';
import { CoteroModel } from 'src/app/model/cotero.model';
import { CoteroService } from 'src/app/services/cotero.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-cotero',
  templateUrl: './cotero.component.html',
  styleUrls: ['./cotero.component.css']
})
export class CoteroComponent implements OnInit {

  public coteroNew: CoteroModel = new CoteroModel();
  public coteroList: Array<CoteroModel>;

  constructor(public coteroService: CoteroService) { }




  ngOnInit() {
    this.getCoteros(1);
  }
  crearCot(){
    this.coteroNew=new CoteroModel();
  }

  editarCotero(cotero:CoteroModel){
    this.coteroNew=cotero;
  }

  cambiarEstado(event){
    if (event.target.checked) {
      this.coteroNew.estado=1;
    }else{
      this.coteroNew.estado=0;
    }
  }

  crearCotero() {
    console.log(this.coteroNew);
    let valido: boolean = true;
    let mensageError: string = "Son obligatorios:\n ";
    if (this.coteroNew.nombre == "") {
      mensageError += "nombre\n";
      valido = false;
    }
    if (isNaN(this.coteroNew.peso)) {
      console.log("no es numérico:" + this.coteroNew.peso);
      return;
    }
    if (valido == false) {
      alert(mensageError);
      return;
    }
    if (this.coteroNew.cotero_id == null) {
      this.coteroService.saveCotero(this.coteroNew).subscribe(res => {
        $('#crearCoteroModal').modal('hide');
        this.coteroNew = new CoteroModel();
      });

    } else {
      this.coteroService.updateCotero(this.coteroNew).subscribe(res => {
        $('#crearCoteroModal').modal('hide');
        this.coteroNew = new CoteroModel();
        this.getCoteros(1);
      });
    }

  }



  getCoteros(empresaId: number) {
    this.coteroService.getCoteros(empresaId.toString()).subscribe(res => {
      this.coteroList = res;
      console.log("lista de coteros cargados: " + this.coteroList.length);
    });
  }

}
