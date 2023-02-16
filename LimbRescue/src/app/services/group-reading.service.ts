import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroupReading } from '../models/group-reading.model';
import { Constants } from '../global/Constants';

const baseUrl = Constants.IP+"/api";;

@Injectable({
  providedIn: 'root'
})
export class GroupReadingService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<GroupReading[]> {
    return this.http.get<GroupReading[]>(baseUrl+'/groupreadings');
  }

  get_by_id(id: number): Observable<GroupReading>{
    return this.http.get<GroupReading>(baseUrl+'/groupreading/'+id)
  }

  put(group: GroupReading, id: number){
    const body = {id: id,
                  group_id: group.group_id,
                  reading_id: group.reading_id
                }
    this.http.put(baseUrl+'/groupreading/'+id, body, {observe: 'response'})
  }

  post(group: GroupReading){
    console.log(group)
    const body = {id: group.id,
                  group_id: group.group_id,
                  reading_id: group.reading_id
                  }
    return this.http.post(baseUrl+'/groupreading', body, {observe: 'response'})
  }
}
