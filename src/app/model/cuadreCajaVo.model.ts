export class CuadreCajaVoModel {
    public empleados:any;
    public grupos:any
    public SubGrupos:any
    public total_facturas: number;
    public total_notas:number;
    public documentos_no_impresos: number;
    public abonos: number;
    public avanceEfectivo: number;
    public chequesRecogidos: number;
    public otros: number;
    public base: number;
    public consignaciones: number;
    public totalIngresos: number;
    public fajos: number;
    public moneda: number;
    public efectivo: number;
    public cheques: number;
    public tarjetas: number;
    public varios: number;
    public vales: number;
    public cartera: number;
    public gastado: number;
    public nomina: number;
    public descuento: number;
    public propina: number;
    public totalCaja: number;
    public diferencia: number;
    public retiro_caja: number;

    constructor(){
        this.grupos=[];
        this.SubGrupos=[];
        this.total_facturas=0;
        this.total_notas=0;
        this.documentos_no_impresos=0;
        this. abonos=0;
        this. avanceEfectivo=0;
        this. chequesRecogidos=0;
        this. otros=0;
        this. base=0;
        this. consignaciones=0;
        this. totalIngresos=0;
        this. fajos=0;
        this. moneda=0;
        this. efectivo=0;
        this.cheques=0;
        this.tarjetas=0;
        this. varios=0;
        this. vales=0;
        this. cartera=0;
        this. gastado=0;
        this. nomina=0;
        this. descuento=0;
        this. propina=0;
        this.totalCaja=0;
        this.diferencia=0;
        this.retiro_caja=0;
    }
}
