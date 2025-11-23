import { Component,input } from '@angular/core';
import { HousingLocationInfo } from '../housinglocation';

@Component({
  selector: 'app-housing-location',
  template: `
  <p>{{housingLocation().name}}</p>
  `,
  styleUrls: ['./housing-location.css'],
})
export class HousingLocation {
  housingLocation = input.required<HousingLocationInfo>();
}
