"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../index");
/**
 * Marks entity to work like a tree.
 */
function Tree(type) {
    return function (target) {
        var args = {
            target: target,
            type: type
        };
        index_1.getMetadataArgsStorage().trees.push(args);
    };
}
exports.Tree = Tree;

//# sourceMappingURL=Tree.js.map
