import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from '../models/group.model';
import { Constants } from '../global/Constants';

const baseUrl = Constants.IP+"/api";;

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Group[]> {
    return this.http.get<Group[]>(baseUrl+'/groups');
  }

  get_by_id(id: number): Observable<Group>{
    return this.http.get<Group>(baseUrl+'/group/'+id)
  }

  get_by_name(name: string): Observable<Group>{
    return this.http.get<Group>(baseUrl+'/group?name='+name)
  }

  put(group: Group, id: number){
    const body = {id: id,
                  name: group.name,
                  reading_ids: group.reading_ids
                }
    return this.http.put(baseUrl+'/group/'+id, body, {observe: 'response'})
  }

  post(group: Group){
    const body = {id: group.id,
      name: group.name,
      reading_ids: group.reading_ids
    }
    return this.http.post(baseUrl+'/group', body, {observe: 'response'})
  }
}
