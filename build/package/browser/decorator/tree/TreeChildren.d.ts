/**
 * Marks a specific property of the class as a children of the tree.
 */
export declare function TreeChildren(options?: {
    cascade?: boolean | ("insert" | "update" | "remove")[];
}): Function;
