import { Injectable } from '@angular/core';
import { SpriteItem } from '../model/interface';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  importPackage:SpriteItem[] = [];
  isRoleDefaultRight:boolean = true;
  constructor() { }

  getPackage(spriteList:SpriteItem[]) {
    this.importPackage = spriteList;
  }

  sendPackage() {
    return this.importPackage;
  }
}
