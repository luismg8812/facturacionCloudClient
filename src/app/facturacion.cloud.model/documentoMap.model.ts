import { DocumentoModel } from '../model/documento.model';
import { DocumentoDetalleModel } from '../model/documentoDetalle.model';

export class DocumentoMapModel {
    public documento: DocumentoModel;
    public documentoDetalle: DocumentoDetalleModel[];
    

    constructor() {
        this.documento = new DocumentoModel();
        this.documentoDetalle = [];
        
    }
}

