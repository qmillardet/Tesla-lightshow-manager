import {Component, OnInit} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DeviceListAddComponent} from "../device-list-add/device-list-add.component";
import {LigthShowDto} from "../Model/LigthShowDto";
import {DeviceList} from "../Model/DeviceList";
import {MountPoint} from "../Model/MountPoint";


const ELEMENT_DATA: DeviceList[] = [];

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: `./device-list.component.html`,
  styleUrl: './device-list.component.css'
})
export class DeviceListComponent implements OnInit {

  displayedColumns: string[] = ['mountpoint', 'actions'];
  dataSource: MountPoint[] = [];

  ejectedDevice : MountPoint[] = [];

  constructor(public dialog: MatDialog, private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    setInterval((): void => {
      (<any>window).device.info().then((e: any) => {
        this.dataSource = e;
        this.ejectedDevice.forEach((mountpoint : MountPoint) => {
          if (!this.dataSource.includes(mountpoint)){
            let index = this.ejectedDevice.indexOf(mountpoint);
            this.ejectedDevice.slice(index, 1)
          }
        })
      })
    }, 2000)
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "Fermer");
  }

  openElement(mountPoint: MountPoint): void {
    const dialogRef = this.dialog.open(DeviceListAddComponent, {
      data: mountPoint,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        let deviceName: string = result.device.path;
        let mountPoint: string = result.device.label
        let lightshows: string[] = result.lightshows.value;
        let resSuccess: string[] = [];
        let resError: string[] = [];
        let toRemoveLightshow: string[] = [];
        result.allLightshow.forEach((lightshow: LigthShowDto) => {

          if (!lightshows.includes(lightshow.lightshowName)) {
            toRemoveLightshow.push(lightshow.lightshowName)
          }
        })

        if (lightshows) {
          lightshows.forEach(async (lightshow: string) => {

            if (lightshow) {
              try {
                await (<any>window).lightshow.copy(deviceName, mountPoint, lightshow)
              } catch (e: any) {
                console.log(e.message)
              }
            }

          });
        }

        if (toRemoveLightshow) {
          toRemoveLightshow.forEach(async (lightshow: string) => {

            if (lightshow) {
              await (<any>window).lightshow.remove(deviceName, mountPoint, lightshow)
            }

          });
        }
      }

    });
  }

  ejectDevice(mountPoint: MountPoint) {
    (<any>window).device.eject(mountPoint.path)
    this.ejectedDevice.push(mountPoint);
  }
}
