import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../model/usuario.model';
import { RolModel } from '../model/rol.model';
import {UsuarioService} from '../services/usuario.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  constructor(private usuarioService:UsuarioService) { 
    this.usuarioBuscar = new UsuarioModel();
    this.roles();
  }

  public usuarioBuscar: UsuarioModel;
  public rolList: Array<RolModel>;

  ngOnInit() {
  }

  roles() {
    let ids:string[]=['1','2','5','6']; //se envia los roles sin develop y propietario
    this.usuarioService.getRolByIds(ids).subscribe(res => {
      this.rolList = res;
    });
  }

}
