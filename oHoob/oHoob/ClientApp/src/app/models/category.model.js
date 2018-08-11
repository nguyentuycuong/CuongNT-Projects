"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Category = /** @class */ (function () {
    function Category(name, description, order) {
        this.name = name;
        this.description = description;
        this.order = order;
    }
    Object.defineProperty(Category.prototype, "friendlyName", {
        get: function () {
            var name = this.name || this.name;
            if (this.name)
                name = this.name + " " + name;
            return name;
        },
        enumerable: true,
        configurable: true
    });
    return Category;
}());
exports.Category = Category;
//# sourceMappingURL=category.model.js.map