import { ObjectType } from "../../common/ObjectType";
import { RelationOptions } from "../options/RelationOptions";
/**
 * One-to-many relation allows to create type of relation when Entity2 can have multiple instances of Entity1.
 * Entity1 have only one Entity2. Entity1 is an owner of the relationship, and storages Entity2 id on its own side.
 */
export declare function OneToMany<T>(typeFunction: (type?: any) => ObjectType<T>, inverseSide: string | ((object: T) => any), options?: RelationOptions): Function;
