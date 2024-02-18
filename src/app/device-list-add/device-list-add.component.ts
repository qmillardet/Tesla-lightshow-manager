import {Component, Inject, OnInit} from '@angular/core';
import {MatButton, MatButtonModule} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule, MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect, MatSelectModule} from "@angular/material/select";
import {CommonModule} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatOptionModule} from "@angular/material/core";
import {LigthShowDto, MountPoint} from "../device-list/device-list.component";

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

