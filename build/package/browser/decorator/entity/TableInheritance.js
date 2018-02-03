import { getMetadataArgsStorage } from "../../index";
/**
 * Sets for entity to use table inheritance pattern.
 */
export function TableInheritance(options) {
    return function (target) {
        var args = {
            target: target,
            pattern: options && options.pattern ? options.pattern : "STI",
            column: options && options.column ? typeof options.column === "string" ? { name: options.column } : options.column : undefined
        };
        getMetadataArgsStorage().inheritances.push(args);
    };
}

//# sourceMappingURL=TableInheritance.js.map
