import { Injectable } from '@angular/core';
import { StorageService } from '@core/google-gapi/models/storage-service.class';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService extends StorageService {
  constructor() {
    super(window.localStorage);
  }
}
