import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { ConfiguracionModel } from '../model/configuracion.model';
import { ParametrosModel } from '../model/parametros.model';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private url = 'http://localhost:3010';
  private socket;

  constructor(public http:HttpClient) {
    this.verificarConexionSocket().subscribe(res => {
      console.log(res);
      if(res==true){
        this.iniciarsocket();
      }
      
    }, error=>{
      console.log("no se detecta socket instalado");
    });
        
    
    
  }

 
  public verificarConexionSocket(){
    return this.http.get<any>(this.url+'/socket');
  }

  iniciarsocket(){
    this.socket = io(this.url);
    console.log("socket io");
  }

  public getPesoGramera(configuracion: ConfiguracionModel) {
    return Observable.create((observer) => {
      console.log("gramera configurada:" + configuracion.gramera)
      try {
        this.socket.emit('gramera', configuracion.gramera);
        this.socket.on('gramera', (message) => {
          console.log("respuesta socket:" + message)
          observer.next(message);
        });
      } catch (error) {
        alert("Existe un error con el socket, verifique que se encuentre abierto. Si el problema persiste consulte a soporte");
      } 
     
    });
  }
}
