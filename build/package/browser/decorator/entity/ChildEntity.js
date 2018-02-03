import { getMetadataArgsStorage } from "../../index";
/**
 * Special type of the table used in the single-table inherited tables.
 */
export function ChildEntity(discriminatorValue) {
    return function (target) {
        var tableMetadataArgs = {
            target: target,
            name: undefined,
            type: "entity-child",
            orderBy: undefined
        };
        getMetadataArgsStorage().tables.push(tableMetadataArgs);
        if (discriminatorValue) {
            var discriminatorValueMetadataArgs = {
                target: target,
                value: discriminatorValue
            };
            getMetadataArgsStorage().discriminatorValues.push(discriminatorValueMetadataArgs);
        }
    };
}

//# sourceMappingURL=ChildEntity.js.map
