import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize',
})
export class CapitalizePipe implements PipeTransform {
  transform(value: string): string {
    if (!value || value.length === 0) {
      return value;
    }
    if (value.length === 1) {
      return value.toLocaleUpperCase();
    }
    return (
      value.substring(0, 1).toLocaleUpperCase() +
      value.substring(1).toLocaleLowerCase()
    );
  }
}
