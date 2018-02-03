"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../index");
/**
 * Special type of the table used in the single-table inherited tables.
 */
function ChildEntity(discriminatorValue) {
    return function (target) {
        var tableMetadataArgs = {
            target: target,
            name: undefined,
            type: "entity-child",
            orderBy: undefined
        };
        index_1.getMetadataArgsStorage().tables.push(tableMetadataArgs);
        if (discriminatorValue) {
            var discriminatorValueMetadataArgs = {
                target: target,
                value: discriminatorValue
            };
            index_1.getMetadataArgsStorage().discriminatorValues.push(discriminatorValueMetadataArgs);
        }
    };
}
exports.ChildEntity = ChildEntity;

//# sourceMappingURL=ChildEntity.js.map
