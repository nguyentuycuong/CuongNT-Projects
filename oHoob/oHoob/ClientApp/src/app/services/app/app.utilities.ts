import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
//import { OnInit } from "@angular/core";

export class AppUtilities
{
  //isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  //  .pipe(
  //    map(result => result.matches)
  //);

  //constructor(private breakpointObserver: BreakpointObserver) {}

  private getImageLibrary() {


    var images = '';
    var table = document.getElementById("tblCustomers") as HTMLTableElement;

    var rows = table.tBodies[0].rows;

    for (var _i: number = 0; _i < rows.length; _i++) {
      //images += rows[_i].cells[0].innerText + ";";      
    }

    for (let item of this.uploader.queue) {
      images += item.file.name + ";";
    }

    alert(images);
    return images;
  };
}
