import { AppConfigService } from '../services/app-config.service';

export class ParametrosModel {
    public serverUrl:string;
    public ambiente:string;
    
    constructor(){
        //this. serverUrl='https://facturacioncloud2019.herokuapp.com';
        this. serverUrl=AppConfigService.ip+':'+AppConfigService.port;
        this.ambiente = 'local';
        //this.ambiente = 'cloud';

    } 
}