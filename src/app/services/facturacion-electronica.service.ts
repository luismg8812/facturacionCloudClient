import { Injectable } from '@angular/core';
import { EnvioFacturacionElectronicaModel } from '../facturacion.cloud.model/envioFacturacionElectronica.model';
import {HttpClient} from '@angular/common/http';
import { AppConfigService } from './app-config.service';
import { DocumentoModel } from '../model/documento.model';
import { GetFileModel } from '../facturacion.cloud.model/getFile.model';
import { ParametrosModel } from '../model/parametros.model';

@Injectable({
  providedIn: 'root'
})
export class FacturacionElectronicaService {

   url_send_invoice:string= AppConfigService.ws_envios_dian;
   url_get_xml:string= AppConfigService.get_xml;
   parametros: ParametrosModel = new ParametrosModel;
  public server_api =this.parametros.serverUrl;

  constructor(public http:HttpClient) { }

  enviarFactura(envioFacturacionElectronicaModel:EnvioFacturacionElectronicaModel){
    let json:string = JSON.stringify(envioFacturacionElectronicaModel) 
    console.log(json);
    let res:any = this.http.post<any>(this.url_send_invoice,json);
    console.log(res);
    return res;
  }

  getXML(documento:GetFileModel){
    let json:string = JSON.stringify(documento) ;
    console.log(json);
    return this.http.post<any>(this.url_get_xml,json);
  }

  sendMail(mail){
    return this.http.post<any>(this.server_api+ '/api/sendMail',mail);
  }

  

  
}
