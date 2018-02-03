import { ObjectType } from "../common/ObjectType";
/**
 * Thrown when no result could be found in methods which are not allowed to return undefined or an empty set.
 */
export declare class EntityNotFoundError extends Error {
    name: string;
    constructor(entityClass: ObjectType<any> | string, criteria: any);
    private stringifyCriteria(criteria);
}
