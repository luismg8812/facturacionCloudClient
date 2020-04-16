import { Injectable } from '@angular/core';
import { EnvioFacturacionElectronicaModel } from '../facturacion.cloud.model/envioFacturacionElectronica.model';
import {HttpClient} from '@angular/common/http';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class FacturacionElectronicaService {

   url:string= AppConfigService.ws_envios_dian;

  constructor(public http:HttpClient) { }

  enviarFactura(envioFacturacionElectronicaModel:EnvioFacturacionElectronicaModel){
    let json:string = JSON.stringify(envioFacturacionElectronicaModel) 
    //json=json.substring(1,json.length-1);
    console.log(json);
    return this.http.post<any>(this.url,json);
  }
}
