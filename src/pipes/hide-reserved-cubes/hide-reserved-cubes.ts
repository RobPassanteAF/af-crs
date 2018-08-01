import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the HideReservedCubesPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'hideReservedCubesPipe',
})
export class HideReservedCubesPipe implements PipeTransform {

  transform(items: any[]): any[] {
    if(!items) return [];
    return items.filter( it => {
      return ( it.permanent === false );
    });
   }
}
