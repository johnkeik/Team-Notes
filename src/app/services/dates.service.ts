import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DatesService {
  constructor() {}

  public getActiveWeekStartDate(activeDate: Date) {
    return new Date(
      activeDate.getFullYear(),
      activeDate.getMonth(),
      activeDate.getDate() - activeDate.getDay()
    );
  }

  public getNextWeekStartDate(activeDate: Date) {
    return new Date(
      activeDate.getFullYear(),
      activeDate.getMonth(),
      activeDate.getDate() + 7
    );
  }

  public getPrevWeekStartDate(activeDate: Date) {
    return new Date(
      activeDate.getFullYear(),
      activeDate.getMonth(),
      activeDate.getDate() - 7
    );
  }

  public formatDateString(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  public getEndDate(startDate: Date): Date {
    return new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() + 6
    );
  }
}
