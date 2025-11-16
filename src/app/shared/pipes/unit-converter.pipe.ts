import { Pipe, PipeTransform } from '@angular/core';
import { UnidadesMedida } from '../models/perfil.model';

@Pipe({
  name: 'unitConverter',
  standalone: true
})
export class UnitConverterPipe implements PipeTransform {
  /**
   * Convierte peso entre KG y LBS
   * @param value - Valor en KG (siempre se asume que viene en KG del backend)
   * @param targetUnit - Unidad objetivo ('KG' o 'LBS')
   * @param decimals - Número de decimales (default: 1)
   */
  transform(value: number | null | undefined, targetUnit: UnidadesMedida = UnidadesMedida.KG, decimals: number = 1): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '-';
    }

    let convertedValue: number;

    if (targetUnit === UnidadesMedida.LBS) {
      // Convertir de KG a LBS
      convertedValue = value * 2.20462;
    } else {
      // Mantener en KG
      convertedValue = value;
    }

    return `${convertedValue.toFixed(decimals)} ${targetUnit}`;
  }
}
