import { DataJSONModel } from './datajson.model';

export class EnvioFacturacionElectronicaModel {
    key: string;
    datajson: DataJSONModel;
    contructor() {
        this.key = "";
        this.datajson = new DataJSONModel();
    }
}
