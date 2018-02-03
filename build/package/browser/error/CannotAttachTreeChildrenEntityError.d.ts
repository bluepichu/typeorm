/**
 * Thrown when user saves tree children entity but its parent is not saved yet.
*/
export declare class CannotAttachTreeChildrenEntityError extends Error {
    constructor(entityName: string);
}
