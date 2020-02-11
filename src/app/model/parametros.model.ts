export class ParametrosModel {
    public serverUrl:string;
    public ambiente:string;
    
    constructor(){
        //this. serverUrl='https://facturacioncloud2019.herokuapp.com';
        this. serverUrl='http://localhost:9090';
        this.ambiente = 'local';
         //this.ambiente = 'cloud';

    } 
}