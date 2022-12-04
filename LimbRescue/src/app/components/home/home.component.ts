import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ViewChild, Inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Reading } from 'src/app/models/reading.model';
import { Group } from 'src/app/models/group.model'
import { ReadingService } from 'src/app/services/reading.service';
import { GroupService } from 'src/app/services/group.service'
import { GroupReadingService } from 'src/app/services/group-reading.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GroupReading } from 'src/app/models/group-reading.model';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { PageSizeInfo } from 'src/app/models/page-size-info.model';
import { PageSizeInfoService } from 'src/app/page-size-info.service';

// Use these date formats for the Date Created section of the home table
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements AfterViewInit {
  // Define variables used for  
  readings!:  Reading[];
  currentReading: Reading = {};
  reading_duration = 30;
  show_spinner = false;
  time_left!: number;
  time_passed!: number;
  value!: number;
  public pageSize = 10;

  // Definition for subscriptions
  readings_sub: any;
  reading_by_id_sub: any;
  group_by_name_sub: any;
  group_create_sub: any;
  reading_update_sub: any;
  date_and_time_sub: any;
  update_dialog_ref_sub: any;
  create_dialog_ref_sub: any;
  post_sub: any;
  timer_sub: any;

  // Columns to be displayedint the home table
  displayedColumns: string[] = ['select', 'editor', 'delete' ,'patient number', 'date', 'laterality', 'show graph', 'comments'];
  dataSource: MatTableDataSource<Reading> = new MatTableDataSource();
  selection_subject = new SelectionModel<Reading>(true, []);

  //Define home table components
  //@ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatTable) matTable!: MatTable<Reading>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;


  constructor(private router: Router, private readingService: ReadingService, private groupService: GroupService, private groupReadingService: GroupReadingService, public dialog: MatDialog, private pageSizeInfo: PageSizeInfoService) {}

  // Ran when the page is initialized
  ngOnInit() {
    // set the data source to thetable components
    this.paginator.pageSize = this.pageSizeInfo.getPageSizeInfo();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log(this.paginator.pageSize);

    // Set up the sort
    const sortState: Sort = {active: 'id', direction: 'desc'};
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
  }

  // Called after the page has initialized
  ngAfterViewInit() {
    // Get  all of the readings for the table and  set it to the table
    this.readings_sub = this.readingService.getAll().subscribe(
      data => {
        this.dataSource.data = data
      })
    // Rerender the table
    this.matTable.renderRows()
  }

  // Called after the page is left
  ngOnDestroy() {
    // Unsubscribe from the subscriptions to prevent resource leaks
    if(this.readings_sub != undefined){
      this.readings_sub.unsubscribe()
    }
    if(this.reading_by_id_sub != undefined){
      this.reading_by_id_sub.unsubscribe()
    }
    if(this.group_by_name_sub != undefined){
      this.group_by_name_sub.unsubscribe()
    }
    if(this.group_create_sub != undefined){
      this.group_create_sub.unsubscribe()
    }
    if(this.reading_update_sub != undefined){
      this.reading_update_sub.unsubscribe()
    }
    if(this.date_and_time_sub != undefined){
      this.date_and_time_sub.unsubscribe()
    }
    if(this.update_dialog_ref_sub != undefined){
      this.update_dialog_ref_sub.unsubscribe()
    }
    if(this.create_dialog_ref_sub != undefined){
      this.create_dialog_ref_sub.unsubscribe()
    }
    if(this.post_sub != undefined){
      this.post_sub.unsubscribe()
    }
    this.pageSize = this.paginator.pageSize;
    this.dataSource.paginator = this.paginator;
  }

  // Used to open the dialog to update a reading
  openUpdateReadingDialog(id: number) {
    // Get a reading by its  id
    this.reading_by_id_sub = this.readingService.getById(id).subscribe(
      reading_data => {
        // open the dialog with the given options
        const dialogRef = this.dialog.open(UpdateReadingDialog, {
          data: reading_data,
          disableClose: true,
          autoFocus: true,
          width: '400px',
        });
        // Used after the dialog is closed
        this.update_dialog_ref_sub = dialogRef.afterClosed().subscribe(output_data => {
          // See if the output data is there
          if(output_data != undefined){
            // Do the update
            this.reading_update_sub = this.readingService.put(output_data, id).subscribe(response => {
              // Get the readings again to update  the table
              this.readings_sub = this.readingService.getAll().subscribe(data => {
                // update the table
                this.dataSource.data = data
                this.matTable.renderRows()
              })
            })
          }
        }
      )
    })
  }

  deleteReading(id: number){
    console.log(id);
    const dialogRef = this.dialog.open(DeleteReadingDialog, {
        data: id,
        disableClose: true,
        autoFocus: true,
        width: '400px',
    });
    this.update_dialog_ref_sub = dialogRef.afterClosed().subscribe(output_data => {
        if(output_data != undefined){
            this.readingService.deleteReading(id).subscribe(result => {
                console.log(result);
            });
        }
    });
  }

  // Used to create a group
  openCreateGroupFromReadingsDialog() {
    // Get the  selected subjects and get their ids
    let selected_subjects = this.getSelectedSubjects()
    let subject_ids = this.getSelectionArrayIds(selected_subjects)

    // Create a group to be passed  in
    let group = new Group()
    group.reading_ids = subject_ids

    // Create the dialog withthe given options
    const dialogRef = this.dialog.open(CreateGroupFromReadingsDialog, {
      data: group,
      disableClose: true,
      autoFocus: true,
      width: '500px',
    });

    // After the dialog is closed
    this.create_dialog_ref_sub = dialogRef.afterClosed().subscribe(output_data => {
      // If the dialog wasnt filled out before closing
      if(output_data != undefined){
        // set the id to 1 so the backend can figure out the correect id
        output_data.id = 1

        // Create the group
        this.post_sub = this.groupService.post(output_data).subscribe(data => {
          // Get the group that you just created
          this.group_by_name_sub = this.groupService.get_by_name(output_data.name).subscribe(result => {
            // Get the reading ids in the group
            let reading_id_arr = result.reading_ids!.split(",").map(Number)

            // Create a new group reading object
            let groupReading = new GroupReading()

            // Set the id to 1 so the  backend can find the correct id
            groupReading.id = 1

            // set the group id to the id of the group you just creeated
            groupReading.group_id = result.id

            //Go through each reeading id and create a connection in the backend
            for(let num of reading_id_arr){
              groupReading.reading_id = num
              this.group_create_sub = this.groupReadingService.post(groupReading).subscribe(data => {})
            }
          })
        })
      }
      // reset the selection
      this.selection_subject.clear()
    })
  }

  // Used when the start reading button is pressed
  startReading(){
    // Get the current date and time
    this.date_and_time_sub = this.readingService.getDateAndtime(parseInt(String(this.reading_duration))*1000).subscribe(time => {})
    
    // Create a timer with 
    let timer_var = timer(0, 1000)

    // Create a variable for the timer length
    let timer_length = parseInt(String(this.reading_duration))+3

    // Start the spinner
    this.show_spinner = true
    
    // Start to get  timer values
    this.timer_sub = timer_var.subscribe(val => {
      // Get the  amount of time passed
      this.time_passed = val

      // Get the amount of time left
      this.time_left = timer_length-val

      // This value is used for the  spinner completion value for a progress spinner
      this.value = parseInt(String((this.time_passed/(timer_length-1))*100), 10)

      // If the timer is over
      if(this.time_left == 0){
        // Unsubscribe to stop timer
        this.timer_sub.unsubscribe()
        // Stop showingthe  spinner
        this.show_spinner = false
      }
    })
  }

  // Called from the  show graph button on the home page
  showGraph(id: number, lat: string){
    // Navigate to the homepage wit query parameters to show graph
    this.router.navigate(['/graph'], { queryParams: {reading_id: id, laterality: lat}})
  }

  // Table filtering and selectiing below
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedSubject() {
    const numSelected = this.selection_subject.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleSubject() {
    if (this.isAllSelectedSubject()) {
      this.selection_subject.clear();
      return;
    }

    this.selection_subject.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabelSubject(row?: Reading): string {
    if (!row) {
      return `${this.isAllSelectedSubject() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection_subject.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  // Return the subjects that are selected
  getSelectedSubjects() {
    return this.selection_subject.selected
  }
  
  // Get the ids for the  selected subjects
  getSelectionArrayIds(arr: Array<Reading>){
    let reading_ids = ''
    arr.forEach(item => reading_ids+=item.id+',')
    reading_ids = reading_ids.substring(0,reading_ids.length - 1)
    return reading_ids
  }

  onPaginateChange(event?:PageEvent) {
    this.pageSize = event!.pageSize;
    this.pageSizeInfo.setPageSizeInfo(this.pageSize);
    console.log(this.pageSizeInfo.getPageSizeInfo());
    this.paginator.pageSize = event!.pageSize;
    console.log(this.paginator.pageSize);
  }
}


///////////////////////////////////////////////
////         Update Reading Dialog         ////
///////////////////////////////////////////////

@Component({
  selector: 'update-reading-dialog',
  templateUrl: 'update-reading-dialog.html',
  styleUrls: ['./home.component.sass'],
})
export class UpdateReadingDialog {
  id: string
  patient_num: string | undefined
  date_created: Date | undefined
  laterality: string | undefined
  notes: string | undefined

  form!: FormGroup

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<UpdateReadingDialog>, @Inject(MAT_DIALOG_DATA) public data: Reading) {
    this.id = data.id
    this.patient_num = data.patient_num
    this.date_created = data.date_created
    this.laterality = data.laterality
    this.notes = data.notes
  }

  ngOnInit() {
    this.form = this.fb.group({
        id: [this.id, []],
        patient_num: [this.patient_num, []],
        date_created: [this.date_created, []],
        laterality: [this.laterality, []],
        notes: [this.notes, []]
    });
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}

///////////////////////////////////////////////
////         DELETE Reading Dialog         ////
///////////////////////////////////////////////

@Component({
  selector: 'delete-reading-dialog',
  templateUrl: 'delete-reading-dialog.html',
  styleUrls: ['./home.component.sass'],
})

export class DeleteReadingDialog {
  id: number

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<UpdateReadingDialog>, @Inject(MAT_DIALOG_DATA) public data: number) {
    this.id = data
  }

  ngOnInit() {
  }

  save() {
    this.dialogRef.close(true);
  }

  close() {
    this.dialogRef.close();
  }
}

///////////////////////////////////////////////
////   Create Group From Selected Dialog   ////
///////////////////////////////////////////////
@Component({
  selector: 'create-group-from-readings-dialog',
  templateUrl: 'create-group-from-readings-dialog.html',
  styleUrls: ['./home.component.sass'],
})
export class CreateGroupFromReadingsDialog {
  id: number | undefined
  name: string | undefined
  reading_ids: string | undefined

  form!: FormGroup

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<CreateGroupFromReadingsDialog>, @Inject(MAT_DIALOG_DATA) public data: Group) {
    this.id = data.id
    this.name = data.name
    this.reading_ids = data.reading_ids
  }

  ngOnInit() {
    this.form = this.fb.group({
        id: [this.id, []],
        name: [this.name, []],
        reading_ids: [this.reading_ids, []]
    });
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }

}
