import { EmpleadoModel } from './empleado.model';
import { DocumentoModel } from './documento.model';
import { ProductoEmpleadoModel } from './productoEmpleado.model';
import { NominaModel } from './nomina.model';

export class DetalleNominaModel {
    public empleado:EmpleadoModel;
    public nomina:NominaModel;
    public ordenes: Array<DocumentoModel>;
    public vales: Array<DocumentoModel>;
    public productos:  Array<ProductoEmpleadoModel>;

    constructor(){
        this.empleado=new EmpleadoModel();
    }
}

