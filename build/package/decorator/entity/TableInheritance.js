"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../index");
/**
 * Sets for entity to use table inheritance pattern.
 */
function TableInheritance(options) {
    return function (target) {
        var args = {
            target: target,
            pattern: options && options.pattern ? options.pattern : "STI",
            column: options && options.column ? typeof options.column === "string" ? { name: options.column } : options.column : undefined
        };
        index_1.getMetadataArgsStorage().inheritances.push(args);
    };
}
exports.TableInheritance = TableInheritance;

//# sourceMappingURL=TableInheritance.js.map
