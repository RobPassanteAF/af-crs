import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'hideReservedCubes'
})
export class HideReservedCubes implements PipeTransform {
  transform(items: any[]): any[] {
    if(!items) return [];
    return items.filter( it => {
      return ( it.permanent === false );
    });
  }
}
