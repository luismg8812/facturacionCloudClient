import { AppConfigService } from '../services/app-config.service';

export class ParametrosModel {
    public serverUrl:string;
    public ambiente:string;
    
    constructor(){
        this. serverUrl='https://losquesonserver.herokuapp.com';
        //this. serverUrl=AppConfigService.ip+':'+AppConfigService.port;
        //this.ambiente = 'local';
        this.ambiente = 'cloud';
    } 
}