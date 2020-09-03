import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../model/usuario.model';
import { UsuarioService } from '../services/usuario.service';
import { ActivacionModel } from '../model/activacion';
import { ActivacionUsuarioModel } from '../model/activacionUsuario.model';

@Component({
  selector: 'app-liberar-cuadre',
  templateUrl: './liberar-cuadre.component.html',
  styleUrls: ['./liberar-cuadre.component.css']
})
export class LiberarCuadreComponent implements OnInit {

  constructor(public usuarioService: UsuarioService) { }

  public usuarios: Array<UsuarioModel>;
  public usuariosList: any;
  public empresaId: number;

  readonly ACTIVACION_BLOQ_CUADRE: string = '17';

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.getUsuarios(this.empresaId);
  }

  formatearNumber(number: number) {
    let formato: string = "";
    formato = new Intl.NumberFormat().format(number);
    return formato;
  }

  selectOrdenOne(or: UsuarioModel, event) {
    let activacion: ActivacionUsuarioModel = new ActivacionUsuarioModel();
    activacion.activacion_id = this.ACTIVACION_BLOQ_CUADRE;
    activacion.estado = '1';
    activacion.usuario_id = or.usuario_id.toString();
    if (event.target.checked) {
      this.usuarioService.saveActivacionUsuario(activacion).subscribe(res => {
        this.getUsuarios(this.empresaId);
        
      });
    } else {
      this.usuarioService.deleteActivacionUsuario(activacion).subscribe(res => {
        this.getUsuarios(this.empresaId);
      });
    }
  }

  getUsuarios(empresaId: number) {
    this.usuarioService.getLiberarCuadre(empresaId).subscribe(res => {
      this.usuariosList = res;
    });
  }

}
