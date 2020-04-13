import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  static ip;
  static port:string;

  constructor(private http: HttpClient) { }

  load() {
    const jsonFile = 'assets/config/config.json';
    return new Promise<void>((resolve, reject) => {
        this.http.get(jsonFile).toPromise().then((response:any ) => {
          AppConfigService.ip = response.ip;
          AppConfigService.port = response.port;
           resolve();
        }).catch((response: any) => {
           reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
        });
    });
}
}
