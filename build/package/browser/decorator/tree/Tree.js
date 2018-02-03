import { getMetadataArgsStorage } from "../../index";
/**
 * Marks entity to work like a tree.
 */
export function Tree(type) {
    return function (target) {
        var args = {
            target: target,
            type: type
        };
        getMetadataArgsStorage().trees.push(args);
    };
}

//# sourceMappingURL=Tree.js.map
