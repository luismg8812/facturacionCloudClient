import { Injectable } from '@angular/core';
import { ProductoModel } from '../model/producto.model';
import { DocumentoModel } from '../model/documento.model';
import { DocumentoDetalleModel } from '../model/documentoDetalle.model';
import { ParametrosModel } from '../model/parametros.model';

@Injectable({
	providedIn: 'root'
})
export class CalculosService {

	constructor() { }

	public fechaActual() {
		let fecha = new Date;
		let parametros: ParametrosModel = new ParametrosModel;
		if (parametros.ambiente == 'cloud') {
			fecha.setDate(fecha.getDate() - 0.2083);
			fecha.setDate(fecha.getDate() + 1);
		}	
		return fecha;
	}

	public fechaInicial(hoy: Date) {
		hoy = (hoy == null ? new Date() : hoy);
		hoy.setHours(0);
		hoy.setMinutes(0);
		hoy.setSeconds(0);
		return hoy;
	}

	public fechaInicial1(hoy:string) {
		let hoy1:Date =  new Date(hoy)  ;
		hoy1.setHours(0);
		hoy1.setMinutes(0);
		hoy1.setSeconds(0);
		return hoy1;
	}

	public fechaFinal(hoy: Date) {
		hoy = (hoy == null ? new Date() : hoy);
		hoy.setHours(23);
		hoy.setMinutes(59);
		hoy.setSeconds(59);
		return hoy;
	}

	public fechaFinal1(hoy:string) {
		let hoy1 =  new Date(hoy) ;
		hoy1.setHours(23);
		hoy1.setMinutes(59);
		hoy1.setSeconds(59);
		return hoy1;
	}



	public validarPromo(ps: ProductoModel, cantidad: number) {
		console.log("valida promocion");
		let valido: boolean = true;
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

	public calcularExcento(doc: DocumentoModel, productos: Array<DocumentoDetalleModel>) {
		let totalReal: number = 0.0;
		let exectoReal: number = 0.0;
		let gravado: number = 0.0;
		let ivatotal: number = 0.0;
		let peso: number = 0.0;
		let iva5: number = 0.0;
		let iva19: number = 0.0;
		let base5: number = 0.0;
		let base19: number = 0.0;
		let costoTotal: number = 0.0;
		// aqui voy toca poner a sumar las variables nuebas para que se reflejen
		// en el info diario
		for (var i = 0; i < productos.length; i++) {
			let costoPublico: number = productos[i].parcial;
			let costo = productos[i].costo_producto * productos[i].cantidad;
			var iva1 = productos[i].impuesto_producto / 100.0;
			let peso1 = productos[i].peso_producto;
			peso1 = peso1 * productos[i].cantidad;
			totalReal = Number(totalReal) + Number(costoPublico);
			costoTotal = costoTotal + costo;
			let temp: number = 0;
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
			} else {
				temp = Number(costoPublico);
				exectoReal = Number(exectoReal) + temp;
			}
		}
		doc.total = totalReal;
		doc.saldo = totalReal;
		doc.excento = exectoReal;
		doc.gravado = gravado;
		doc.iva = ivatotal;
		doc.peso_total = peso;
		doc.iva_5 = iva5;
		doc.iva_19 = iva19;
		doc.base_5 = base5;
		doc.base_19 = base19;
		doc.total_costo = costoTotal;
		return doc;
	}

	public centrarDescripcion(nombre: string, maxTamanoNombre: number) {
		console.log(nombre);
		let tamanoNombre: number = nombre.length;
		let espacio: string = "";
		if (maxTamanoNombre < tamanoNombre) {
			return nombre;
		}
		let tamanoEspacio: number = (maxTamanoNombre - tamanoNombre) / 2;
		if (tamanoNombre != 0) {
			for (var j = 0; j < tamanoEspacio; j++) {
				espacio += " ";
			}
		}
		nombre = espacio + nombre;
		return nombre;
	}

	public cortarDescripcion(nombre: string, maxTamanoNombre: number) {
		let unit:string = "";
		nombre=(nombre==undefined?"":nombre);
		let tamañoCantidad:number = (nombre==undefined?0:nombre.length);
		if(tamañoCantidad>maxTamanoNombre){
			unit = nombre.trim().substring(0, maxTamanoNombre);
		}else{
			unit=nombre.trim();
			for (var j = tamañoCantidad; j < maxTamanoNombre; j++) {
				unit =  unit+" ";
			}
		}
		return unit;
	}

	public  cortarCantidades( cantidad:string,  maxTamanoUnit:number) {
		let unit:string = "";
		let tamañoCantidad:number = cantidad.length;
		if(tamañoCantidad>maxTamanoUnit){
			unit = unit.substring(0, maxTamanoUnit);
		}else{
			unit=cantidad;
			for (var j = tamañoCantidad; j < maxTamanoUnit; j++) {
				unit = " " + unit;
			}
		}
		return unit;
	}



}
