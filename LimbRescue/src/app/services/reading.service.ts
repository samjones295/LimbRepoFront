import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reading } from '../models/reading.model';
import { Constants } from '../global/Constants';

const baseUrl = Constants.IP+"/api";

@Injectable({
  providedIn: 'root'
})
export class ReadingService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Reading[]> {
    
    return this.http.get<Reading[]>(baseUrl+'/readings');
    
  }

  getAllOfPatient(patient_num: string): Observable<Reading[]> {
    return this.http.get<Reading[]>(baseUrl+'/readings?patient_num='+patient_num);
  }

  getById(id: number): Observable<Reading>{
    return this.http.get<Reading>(baseUrl+'/reading/'+id)
  }

  getByString(patient_num: string): Observable<Reading[]>{
    return this.http.get<Reading[]>(baseUrl+'/reading?patient_num='+patient_num)
  }

  put(reading: Reading, id: number){
    const body = {id: id,
                  patient_num: reading.patient_num,
                  date_created: reading.date_created,
                  laterality: reading.laterality,
                  notes: reading.notes}
    return this.http.put(baseUrl+'/reading/'+id, body, {observe: 'response'})
  }

  deleteReading(id: number){
    return this.http.delete(baseUrl+"/reading/" + id);
  }
  
  getDateAndtime(delta: number): Observable<String>{
    return this.http.get<String>(baseUrl+'/start?delta='+delta)
  }
}
