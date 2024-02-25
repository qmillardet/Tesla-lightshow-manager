import {Component, Inject} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {CommonModule} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatOptionModule} from "@angular/material/core";
import {MountPoint} from "../Model/MountPoint";
import {LigthShowDto} from "../Model/LigthShowDto";

@Component({
  selector: 'app-device-list-add',
  standalone: true,
  imports: [
    MatDialogModule, MatButtonModule, CommonModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatOptionModule
  ],
  templateUrl: './device-list-add.component.html',
  styleUrl: './device-list-add.component.css'
})
export class DeviceListAddComponent {
  deviceName : MountPoint;

  toppings = new FormControl('');
  toppingList: LigthShowDto[] = [];
  selectedElement : string[] =[];

  constructor(
    public dialogRef: MatDialogRef<DeviceListAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MountPoint,
  ) {
    this.deviceName = data;
  }

  ngOnInit(): void {
    (<any>window).lightshow.list(this.deviceName).then((e:LigthShowDto[] ) => {
      this.selectedElement = [];
      e.forEach((lightShowDTO : LigthShowDto) => {
        if (lightShowDTO.onDevice){
          this.selectedElement.push(lightShowDTO.lightshowName)
        }
      })
      this.toppingList = e;
    })

  }
}

