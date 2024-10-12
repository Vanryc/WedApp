import { Component } from '@angular/core';
import { faDroplet, faWind, faCloud, faSun, faThermometerQuarter } from '@fortawesome/free-solid-svg-icons';
import { WeatherService } from '../Services/weather.service';

@Component({
  selector: 'app-right-container',
  templateUrl: './right-container.component.html',
  styleUrls: ['./right-container.component.css']
})
export class RightContainerComponent {
  
  // Icons
  faDroplet = faDroplet;
  faWind = faWind;
  faCloud = faCloud;
  faSun = faSun;
  faThermometerQuarter = faThermometerQuarter;

  // State variables
  isTodayActive = true;
  isWeekActive = false;
  isCelsiusActive = true;
  isFahrenheitActive = false;

  // Example humidity value
  humidity: number = 99; 

  constructor(public weatherService: WeatherService) {}

  // Toggle between 'Today' and 'Week' tabs
  toggleTab(tab: string) {
    if (tab === 'today') {
      this.isTodayActive = true;
      this.isWeekActive = false;
      this.weatherService.today = true;
      this.weatherService.week = false;
    } else if (tab === 'week') {
      this.isTodayActive = false;
      this.isWeekActive = true;
      this.weatherService.today = false;
      this.weatherService.week = true;
    }
  }

  // Handle Celsius click
  onCelsiusClick() {
    this.setMetric('celsius');
  }

  // Handle Fahrenheit click
  onFahrenheitClick() {
    this.setMetric('fahrenheit');
  }

  // Set the temperature metric
  setMetric(metric: string) {
    if (metric === 'celsius') {
      this.isCelsiusActive = true;
      this.isFahrenheitActive = false;
      this.weatherService.celsius = true;
      this.weatherService.fahrenheit = false;
    } else if (metric === 'fahrenheit') {
      this.isCelsiusActive = false;
      this.isFahrenheitActive = true;
      this.weatherService.celsius = false;
      this.weatherService.fahrenheit = true;
    }
  }

  // Determine humidity status
  getHumidityStatus(humidity: number): string {
    if (humidity === 0) {
      return 'Dry';
    } else if (humidity > 0 && humidity <= 60) {
      return 'Comfortable';
    } else {
      return 'Very Humid';
    }
  }
}
