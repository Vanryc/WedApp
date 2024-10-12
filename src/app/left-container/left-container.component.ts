import { Component } from '@angular/core';
import { faLocation } from '@fortawesome/free-solid-svg-icons'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faCloud } from '@fortawesome/free-solid-svg-icons'
import { faCloudRain } from '@fortawesome/free-solid-svg-icons'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { faCloudSun } from '@fortawesome/free-solid-svg-icons'
import { WeatherService } from '../Services/weather.service';

@Component({
  selector: 'app-left-container',
  templateUrl: './left-container.component.html',
  styleUrls: ['./left-container.component.css'] // corrected styleUrl to styleUrls
})
export class LeftContainerComponent {

  faMagnifyingGlass = faMagnifyingGlass;     
  faLocation = faLocation;
  faCloud = faCloud;
  faCloudRain = faCloudRain;
  faLocationDot = faLocationDot;
  faCloudSun = faCloudSun; 
  
  constructor(private weatherService: WeatherService){}

  onSearch() {
    const searchCity = (document.getElementById('searchCity') as HTMLInputElement).value;
    this.weatherService.getData(searchCity);
  }
}