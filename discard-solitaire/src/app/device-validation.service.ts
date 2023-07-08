import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceValidationService {

  public isMobile() {
    if(typeof navigator !== 'undefined') {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    } else  {
      return  false
    }
  }
}
