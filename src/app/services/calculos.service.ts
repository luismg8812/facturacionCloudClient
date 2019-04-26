import { Injectable } from '@angular/core';
import { ProductoModel } from '../model/producto.model';
import { DocumentoModel } from '../model/documento.model';
import { DocumentoDetalleModel } from '../model/documentoDetalle.model';

@Injectable({
  providedIn: 'root'
})
export class CalculosService {

  constructor() { }

  public fechaActual(){
    let fecha= new Date;
    fecha.setDate(fecha.getDate()-0.2083);
    return fecha;
  }

  public validarPromo (ps:ProductoModel, cantidad:number){
    console.log("valida promocion");
    let  valido:boolean = true;
		if (ps.promo == null) {
			valido = false;
			return valido;
		}
		if (ps.promo != 1) {
			valido = false;
			return valido;
		}
		if (ps.kg_promo == null) {
			valido = false;
			return valido;
		} else {
			let can = cantidad == null ? 0.0 : cantidad;
			if (ps.kg_promo > can) {
				valido = false;
				return valido;
			}
		}
		return valido;
  }
	
  public calcularExcento(doc:DocumentoModel,productos:Array<DocumentoDetalleModel> ){
    let totalReal:number = 0.0;
    let exectoReal:number = 0.0;
		let gravado:number = 0.0;
		let ivatotal:number = 0.0;
		let peso:number = 0.0;
		let iva5:number = 0.0;
		let iva19:number = 0.0;
		let base5:number = 0.0;
		let base19:number = 0.0;
		let costoTotal:number =0.0;
		// aqui voy toca poner a sumar las variables nuebas para que se reflejen
		// en el info diario
		for (var i =0;  i<productos.length; i++) {
			let costoPublico:number = productos[i].parcial;
			let costo = productos[i].costo_producto * productos[i].cantidad ;
      var iva1 =productos[i].impuesto_producto / 100.0;
			let peso1 = productos[i].peso_producto;
			peso1 = peso1 * productos[i].cantidad;
			totalReal =Number(totalReal)+ Number(costoPublico);
			costoTotal=costoTotal+costo;
			let temp:number=0;
			ivatotal = ivatotal + ((costoPublico / (1 + iva1)) * iva1);
      peso = peso + peso1;
			// si es iva del 19 se agrega al documento junto con la base
			if (iva1 == 0.19) {
				iva19 = iva19 + ((costoPublico / (1 + iva1)) * iva1);
				base19 = base19 + (costoPublico / (1 + iva1));
			}
			// si es iva del 5 se agrega al documento junto con la base
			if (iva1 == 0.05) {
				iva5 = iva5 + ((costoPublico / (1 + iva1)) * iva1);
				base5 = base5 + (costoPublico / (1 + iva1));
			}
			if (iva1 > 0.0) {
				temp = costoPublico / (1 + iva1);
				gravado += temp;
			}else {
				temp = Number(costoPublico);	
				exectoReal = Number(exectoReal)+temp;
			} 
		}
		doc.total= totalReal;
		doc.saldo=totalReal;
		doc.excento= exectoReal;
		doc.gravado= gravado;
		doc.iva =ivatotal;
		doc.peso_total= peso;
		doc.iva_5= iva5;
		doc.iva_19=iva19;
		doc.base_5= base5;
		doc.base_19= base19;
		doc.total_costo= costoTotal;
		return doc;
  }
  
}
