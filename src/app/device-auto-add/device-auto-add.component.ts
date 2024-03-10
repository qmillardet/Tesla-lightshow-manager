import {Component} from '@angular/core';
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {LogDeviceInfo} from "../Model/LogDeviceInfo";
import {DeviceList} from "../Model/DeviceList";
import {LigthShowDto} from "../Model/LigthShowDto";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {MatOptionModule} from "@angular/material/core";
import {DeviceListAddComponent} from "../device-list-add/device-list-add.component";
import {MountPoint} from "../Model/MountPoint";


@Component({
  selector: 'app-device-auto-add',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    //MatButton,
    MatDialogModule, MatButtonModule, CommonModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatOptionModule

  ],
  templateUrl: './device-auto-add.component.html',
  styleUrl: './device-auto-add.component.css'
})
export class DeviceAutoAddComponent {
  protected logInfo: LogDeviceInfo[] = [];
  protected previousDevice: MountPoint[] = [];
  protected toppingList: LigthShowDto[] = [];
  protected toppings = new FormControl('');
  protected selectedElement: string[] = [];

  protected isStarted : boolean = false;

  async ngOnInit(): Promise<void> {
    this.getLightshow()
    this.extractArrayOfDevice((mountPoint : MountPoint[]) : void  => {
      this.previousDevice = mountPoint;
    });
    setInterval(() => {this.extractArrayOfDevice(this.executeCopyOnNewDevice.bind(this))}, 1000)
  }

  private getLightshow() {
    (<any>window).lightshow.list('/tmp/toto/').then((e: LigthShowDto[]) => {
      this.toppingList = e;
    })
  }

  protected executeCopyOnNewDevice(actualMountPoint: MountPoint[]) {
    if (this.isStarted){
      let previous: MountPoint[] = this.previousDevice;
      let promise : any = null;
      actualMountPoint.forEach((mountPoint: MountPoint) => {
        if (!this.isMountPointInArray(this.previousDevice, mountPoint)) {
          console.log("detected device")
          this.selectedElement.forEach((lightshow: string) => {
            if (promise === null){
              promise = (<any>window).lightshow.copy(mountPoint.path, mountPoint.label, lightshow);
              console.log('null')
            } else {
              promise = promise.then(()=> {
                (<any>window).lightshow.copy(mountPoint.path, mountPoint.label, lightshow);
              })
              console.log("prmoise : ", promise)
            }
          });

          promise.then(() => {
            (<any>window).device.eject(mountPoint.path).then((e: DeviceListAddComponent) => {
              let date = new Date();
              let deviceInfo: LogDeviceInfo = {
                date: date.toString(),
                deviceName: mountPoint.label,
                numberLightshow: BigInt(0),
                eject: true
              }
              this.logInfo.push(deviceInfo);
            });
          })

        }


      })
      this.previousDevice = actualMountPoint;
    }

  }
  protected changeStatus(){
    this.isStarted = !this.isStarted;
  }

  private extractArrayOfDevice(callback : (e : MountPoint[]) => void): void {
    (<any>window).device.info().then( (e : MountPoint[]) => {
      callback(e)
    })
  }

  private isMountPointInArray(mountPointList : MountPoint[], mountPoint: MountPoint) : boolean {
    let res = false;
    mountPointList.forEach((element: MountPoint) => {
      if (element.label === mountPoint.label && element.path === mountPoint.path) {
        res = true;
      }
    })
    return res;
  }
}
