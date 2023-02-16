import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Result } from '../models/result.model';
import { Constants } from '../global/Constants';

const baseUrl = Constants.IP+"/api";;

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Result[]> {
    return this.http.get<Result[]>(baseUrl+'/results');
  }

  post(result: Result){
    const body = {
      id: result.id,
      group_name: result.group_name,
      date_ran: result.date_ran,
      algorithm: result.algorithm,
      train_accuracy: 0,
      test_accuracy: 0
    }
    return this.http.post(baseUrl+'/result', body, {observe: 'response'})
  }

}
