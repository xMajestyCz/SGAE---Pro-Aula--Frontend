import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  logInfo(message: string) {
    console.info(`[INFO]: ${message}`);
  }

  logWarning(message: string) {
    console.warn(`[WARN]: ${message}`);
  }

  logError(message: string, error?: any) {
    console.error(`[ERROR]: ${message}`, error);
  }

}
