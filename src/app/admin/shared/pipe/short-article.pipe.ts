import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortPipe'
})
export class ShortArticlePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return value.substr(args[0], args[1]) + '...';
  }
}
