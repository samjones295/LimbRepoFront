import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReadingData } from '../models/reading-data.model';
import { Constants } from '../global/Constants';

const baseUrl = Constants.IP+"/api";

@Injectable({
  providedIn: 'root'
})
export class ReadingDataService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<ReadingData[]> {
    return this.http.get<ReadingData[]>(baseUrl+'/data');
  }

  getById(id: number): Observable<ReadingData>{
    return this.http.get<ReadingData>(baseUrl+'/data/'+id)
  }

  getByReadingIdAndLaterality(reading_id: number, laterality: string){
    return this.http.get<ReadingData[]>(baseUrl+"/data?reading_id="+reading_id+"&laterality="+laterality)
  }

}
