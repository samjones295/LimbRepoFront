import { Injectable } from '@angular/core';
import { PageSizeInfo } from './models/page-size-info.model';

@Injectable({
  providedIn: 'root'
})
export class PageSizeInfoService {

  private pageSizeInfo : PageSizeInfo = new PageSizeInfo();

  constructor() { 
    this.pageSizeInfo.pageSize = 10;
  }

  setPageSizeInfo(pageSize: number) {
    this.pageSizeInfo.pageSize = pageSize;
  }

  getPageSizeInfo() {
    return this.pageSizeInfo.pageSize;
  }
}
