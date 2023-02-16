import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CsvData, CsvMetaData } from '../models/csv-data.model';
import { Constants } from 'src/app/global/Constants';

const baseUrl = Constants.IP+"/api";;

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  /*
  This service class contains methods that support the creation of csv files.
  */
  constructor(private http: HttpClient) { }

  // given a reading_id and laterality, return the reading data
  getDataForCSV(reading_id: number, laterality: string){
    return this.http.get<CsvData[]>(baseUrl+"/output?reading_id="+reading_id+"&laterality="+laterality)
  }

  // given a reading id and a patient number, return the meta data for that reading
  getMetaDataForCSV(id: number, patient_no: string){
    return this.http.get<CsvMetaData[]>(baseUrl+"/reading_output?id="+id+"&patient_no="+patient_no)
  }


}
