import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  static ip;
  static port:string;
  static ws_envios_dian:string;
  static key_invoice:string;
  static invoice_status:string;
  static get_xml:string;

  constructor(private http: HttpClient) { }

  load() {
    const jsonFile = 'assets/config/config.json';
    return new Promise<void>((resolve, reject) => {
        this.http.get(jsonFile).toPromise().then((response:any ) => {
          AppConfigService.ip = response.ip;
          AppConfigService.port = response.port;
          AppConfigService.ws_envios_dian = response.ws_envios_dian;
          AppConfigService.key_invoice=response.key_invoice;
          AppConfigService.invoice_status=response.invoice_status;
          AppConfigService.get_xml=response.get_xml;
           resolve();
        }).catch((response: any) => {
           reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
        });
    });
}
}
