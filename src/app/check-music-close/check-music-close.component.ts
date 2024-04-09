import { Component } from '@angular/core';
import {MatButton, MatButtonModule, MatFabButton} from "@angular/material/button";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable, MatTableModule
} from "@angular/material/table";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MountPoint} from "../Model/MountPoint";
import {NgIf} from "@angular/common";
import {MatGridList, MatGridListModule, MatGridTile} from "@angular/material/grid-list";

@Component({
  selector: 'app-check-music-close',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    NgIf,
    MatGridListModule,
    MatIconModule
  ],
  templateUrl: './check-music-close.component.html',
  styleUrl: './check-music-close.component.css'
})
export class CheckMusicCloseComponent {
  private srcResult: any;
  protected displayedColumns: string[] = ['mountpoint', 'actions'];
  protected dataSource: MountPoint[] = [];
  protected audioFile: string = "";
  protected pathAudioFile: string|undefined;
  protected fileName: string = "";

  ngOnInit(): void {
    (<any>window).device.info().then((e: any) => {
      this.dataSource = e;
    })
  }

  onFileSelected() {
    const inputNode: any = document.querySelector('#file');

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.srcResult = e.target.result;
      };

      reader.readAsArrayBuffer(inputNode.files[0]);
     this.audioFile = inputNode.files[0].path;
     this.fileName = this.audioFile.split('/').slice(-1)[0]
    }
  }

  onDeviceSend(element : MountPoint) {
    (<any>window).close.check(this.audioFile,element.path)
  }
}
