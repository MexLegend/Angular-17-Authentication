import { Injectable } from '@angular/core';
import { StorageService } from '@core/firebase-auth/models/storage-service.class';

@Injectable({
  providedIn: 'root',
})
export class WebStorageService extends StorageService {
  constructor() {
    super(window.localStorage);
  }

  useStorage(storageType: 'local' | 'session') {
    this._api =
      storageType === 'session' ? window.sessionStorage : window.localStorage;
  }
}
