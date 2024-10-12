import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationDetails } from '../Models/LocationDetails';
import { WeatherDetails } from '../Models/WeatherDetails';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EnvironmentVariables } from '../Environment/EnvironmentVariables'; // Adjust path if needed
import { TemperatureData } from '../Models/TemperatureData';
import { TodayData } from '../Models/TodayData';
import { WeekData } from '../Models/WeekData';
import { TodaysWeatherForecast } from '../Models/TodaysWeatherForecast';
import { V3WxObservationsCurrent } from '../Models/V3WxObservationsCurrent'; // Adjust the path if needed

interface CurrentWeather {
  dayOfWeek?: string;
  temperature?: number;
  precip24Hour?: number;
  wxPhraseShort?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  locationDetails?: LocationDetails;
  weatherDetails?: WeatherDetails;

  temperatureData: TemperatureData = new TemperatureData();
  todayData: TodayData[] = [];
  weekData: WeekData[] = [];
  todayWeatherForecast: TodaysWeatherForecast = new TodaysWeatherForecast();

  cityName: string = 'Olongapo';
  language: string = 'en-US';
  date: string = '20200622';
  units: string = 'metric'; // Use 'metric' for metric units or 'imperial' for imperial units

  currentTime: Date = new Date();

  today: boolean = true;
  week: boolean = false;
  celsius: boolean = true;
  fahrenheit: boolean = false;

  constructor(private httpClient: HttpClient) {
    this.getData(); // Fetch initial data when the service is instantiated
  }

  getSummaryImage(summary: string): string {
    const baseAddress = 'assets/'; // Use relative path for assets
    const images: { [key: string]: string } = {
      'Partly Cloudy': 'cloudy-sunny-day.png',
      'P Cloudy': 'cloudy-sunny-day.png',
      'Partly Rainy': 'partly-rainy-day.png',
      'P Rainy': 'partly-rainy-day.png',
      'Rainy': 'rainy-day.png',
      'Stormy': 'stormy-day.png',
      'Windy': 'windy-day.png',
      'Cloudy': 'cloudy-day.png'
    };

    for (const key in images) {
      if (summary.includes(key)) {
        return `${baseAddress}${images[key]}`;
      }
    }

    return `${baseAddress}cloudy-sunny-day.png`;
  }

  fillTemperatureDataModel(currentWeather: CurrentWeather) {
    this.temperatureData.day = currentWeather.dayOfWeek || 'Unknown';
    this.temperatureData.time = `${String(this.currentTime.getHours()).padStart(2, '0')}:${String(this.currentTime.getMinutes()).padStart(2, '0')}`;
    this.temperatureData.temperature = currentWeather.temperature ?? 0;
    this.temperatureData.rainPercent = currentWeather.precip24Hour ?? 0;
    this.temperatureData.summaryPhrase = currentWeather.wxPhraseShort || 'No Data Available';
    this.temperatureData.summaryImage = this.getSummaryImage(this.temperatureData.summaryPhrase);
  }

  fillWeekData() {
    this.weekData = [];
    const dailyForecast = this.weatherDetails?.['v3-wx-forecast-daily-15day'];
    if (dailyForecast) {
      for (let i = 0; i < 7; i++) {
        const dayOfWeek = dailyForecast.dayOfWeek[i]?.slice(0, 3) || 'Unknown';
        const tempMax = dailyForecast.calendarDayTemperatureMax[i]?.toString() || 'Unknown';
        const tempMin = dailyForecast.calendarDayTemperatureMin[i]?.toString() || 'Unknown';
        const summary = dailyForecast.narrative[i] || 'No Data Available';
        const summaryImage = this.getSummaryImage(summary);

        this.weekData.push({ day: dayOfWeek, tempMax, tempMin, summaryImage });
      }
    }
  }

  fillTodayData() {
    this.todayData = [];
    const hourlyForecast = this.weatherDetails?.['v3-wx-forecast-hourly-10day'];
    if (hourlyForecast) {
      for (let i = 0; i < 7; i++) {
        const time = hourlyForecast.validTimeLocal[i]?.slice(11, 16) || 'Unknown';
        const temperature = hourlyForecast.temperature[i]?.toString() || 'Unknown';
        const summary = hourlyForecast.wxPhraseShort[i] || 'No Data Available';
        const summaryImage = this.getSummaryImage(summary);
        
        this.todayData .push({ time, temperature, summaryImage });
      }
    }
  }

  fillTodaysForecast(){
    const dailyForecast = this.weatherDetails['v3-wx-forecast-daily-15day'];
    this.todayWeatherForecast.temperatureFeelsLike = Number(dailyForecast.temperatureMax?.[0]) || 0;
  } 
  

  prepareData() {
    this.currentTime = new Date();
    if (this.weatherDetails) {
      const currentWeather = this.weatherDetails['v3-wx-observations-current'] as CurrentWeather;
      this.fillTemperatureDataModel(currentWeather);
      this.fillWeekData();
      this.fillTodayData();
      this.fillTodaysForecast();
    }
  }

  getLocationDetails(cityName: string, language: string): Observable<LocationDetails> {
    const headers = new HttpHeaders()
      .set(EnvironmentVariables.xrapidapikeyName, EnvironmentVariables.xrapidapikeyValues)
      .set(EnvironmentVariables.xrapidapihostName, EnvironmentVariables.xrapidapihostValue);

    const params = new HttpParams()
      .set('city', cityName)
      .set('language', language);

    return this.httpClient.get<LocationDetails>(EnvironmentVariables.locationApiBaseURL, { headers, params })
      .pipe(
        catchError(error => {
          console.error('Error fetching location details:', error);
          return of({} as LocationDetails); // Return an empty LocationDetails object instead of null
        })
      );
  }
  
  
  getWeatherReport(date: string, latitude: number, longitude: number, language: string, units: string): Observable<WeatherDetails> {
    const headers = new HttpHeaders()
      .set(EnvironmentVariables.xrapidapikeyName, EnvironmentVariables.xrapidapikeyValues)
      .set(EnvironmentVariables.xrapidapihostName, EnvironmentVariables.xrapidapihostValue);

    const params = new HttpParams()
      .set('date', date)
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString())
      .set('language', language)  
      .set('units', units);

    return this.httpClient.get<WeatherDetails>(EnvironmentVariables.weatherApiForecastBaseURL, { headers, params })
      .pipe(
        catchError(error => {
          console.error('Error fetching weather details:', error);
          return throwError(() => new Error('Failed to fetch weather details'));
        })
      );
  }

  getData(cityName: string = this.cityName) {
    this.getLocationDetails(cityName, this.language).subscribe({
      next: (response: LocationDetails) => {
        if (response && response.location) {
          this.locationDetails = response;
          console.log('Location details:', this.locationDetails);

          const latitude = this.extractCoordinate(this.locationDetails.location.latitude);
          const longitude = this.extractCoordinate(this.locationDetails.location.longitude);

          console.log('Extracted coordinates:', { latitude, longitude });

          if (this.isValidCoordinate(latitude, 'latitude') && this.isValidCoordinate(longitude, 'longitude')) {
            this.fetchWeatherReport(latitude, longitude);
          } else {
            console.error('Invalid latitude or longitude', { latitude, longitude });
          }
        } else {
          console.error('Location details are undefined or empty');   
          // Handle the error case, maybe set a default location or show an error message
        }
      },
      error: (error) => {
        console.error('Error fetching location details:', error);
        // Handle the error, maybe set a default location or show an error message
      }
    });
  }
  
  private extractCoordinate(coordinateArray: number[] | undefined): number {
    if (!coordinateArray || coordinateArray.length === 0) {
      console.error('Coordinate array is undefined or empty');
      return NaN;
    }
    return coordinateArray[0];
  }
  
  private isValidCoordinate(value: number, type: 'latitude' | 'longitude'): boolean {
    if (isNaN(value)) return false;
    return type === 'latitude' ? value >= -90 && value <= 90 : value >= -180 && value <= 180;
  }
  
  private fetchWeatherReport(latitude: number, longitude: number) {
    this.getWeatherReport(this.date, latitude, longitude, this.language, this.units).subscribe({
      next: (response) => {
        this.weatherDetails = response;
        this.prepareData();
      },
      error: (error) => {
        console.error('Error fetching weather details:', error);
      }
    });
  }

  celsiusToFahrenheit(celsius: number | string): number {
    const celsiusNum = typeof celsius === 'string' ? parseFloat(celsius) : celsius;
    return isNaN(celsiusNum) ? 0 : (celsiusNum * 9/5) + 32;
  }

  fahrenheitToCelsius(fahrenheit: number | string): number {
    const fahrenheitNum = typeof fahrenheit === 'string' ? parseFloat(fahrenheit) : fahrenheit;
    return isNaN(fahrenheitNum) ? 0 : ((fahrenheitNum - 32) * 5) / 9;
  }
}

 