"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import { OnInit } from "@angular/core";
var AppUtilities = /** @class */ (function () {
    function AppUtilities() {
    }
    //isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    //  .pipe(
    //    map(result => result.matches)
    //);
    //constructor(private breakpointObserver: BreakpointObserver) {}
    AppUtilities.prototype.getImageLibrary = function () {
        var images = '';
        var table = document.getElementById("tblCustomers");
        var rows = table.tBodies[0].rows;
        for (var _i = 0; _i < rows.length; _i++) {
            //images += rows[_i].cells[0].innerText + ";";      
        }
        return images;
    };
    ;
    return AppUtilities;
}());
exports.AppUtilities = AppUtilities;
//# sourceMappingURL=app.utilities.js.map