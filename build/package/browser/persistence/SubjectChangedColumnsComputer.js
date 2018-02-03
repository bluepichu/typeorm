import { DateUtils } from "../util/DateUtils";
import { EntityMetadata } from "../metadata/EntityMetadata";
/**
 * Finds what columns are changed in the subject entities.
 */
var SubjectChangedColumnsComputer = /** @class */ (function () {
    function SubjectChangedColumnsComputer() {
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Finds what columns are changed in the subject entities.
     */
    SubjectChangedColumnsComputer.prototype.compute = function (subjects) {
        var _this = this;
        subjects.forEach(function (subject) {
            _this.computeDiffColumns(subject);
            _this.computeDiffRelationalColumns(subjects, subject);
        });
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Differentiate columns from the updated entity and entity stored in the database.
     */
    SubjectChangedColumnsComputer.prototype.computeDiffColumns = function (subject) {
        // if there is no persisted entity then nothing to compute changed in it
        if (!subject.entity)
            return;
        subject.metadata.columns.forEach(function (column) {
            // ignore special columns
            if (column.isVirtual ||
                column.isDiscriminator ||
                column.isUpdateDate ||
                column.isVersion ||
                column.isCreateDate)
                return;
            // get user provided value - column value from the user provided persisted entity
            var entityValue = column.getEntityValue(subject.entity);
            // we don't perform operation over undefined properties (but we DO need null properties!)
            if (entityValue === undefined)
                return;
            // if there is no database entity then all columns are treated as new, e.g. changed
            if (subject.databaseEntity) {
                // get database value of the column
                var databaseValue = column.getEntityValue(subject.databaseEntity);
                // filter out "relational columns" only in the case if there is a relation object in entity
                if (column.relationMetadata) {
                    var value = column.relationMetadata.getEntityValue(subject.entity);
                    if (value !== null && value !== undefined)
                        return;
                }
                // normalize special values to make proper comparision
                if (entityValue !== null && entityValue !== undefined) {
                    if (column.type === "date") {
                        entityValue = DateUtils.mixedDateToDateString(entityValue);
                    }
                    else if (column.type === "time") {
                        entityValue = DateUtils.mixedDateToTimeString(entityValue);
                    }
                    else if (column.type === "datetime" || column.type === Date) {
                        entityValue = DateUtils.mixedDateToUtcDatetimeString(entityValue);
                        databaseValue = DateUtils.mixedDateToUtcDatetimeString(databaseValue);
                    }
                    else if (column.type === "json" || column.type === "jsonb") {
                        entityValue = JSON.stringify(entityValue);
                        if (databaseValue !== null && databaseValue !== undefined)
                            databaseValue = JSON.stringify(databaseValue);
                    }
                    else if (column.type === "sample-array") {
                        entityValue = DateUtils.simpleArrayToString(entityValue);
                        databaseValue = DateUtils.simpleArrayToString(databaseValue);
                    }
                }
                // if value is not changed - then do nothing
                if (entityValue === databaseValue)
                    return;
                // revert entity value back to its original value, because we need to save original value, not a string
                // we used string only for comparision
                if (column.type === "json" || column.type === "jsonb") {
                    entityValue = column.getEntityValue(subject.entity);
                }
            }
            // find if there is already a column to be changed
            var changeMap = subject.changeMaps.find(function (changeMap) { return changeMap.column === column; });
            if (changeMap) {
                changeMap.value = entityValue;
            }
            else {
                subject.changeMaps.push({
                    column: column,
                    value: entityValue
                });
            }
        });
    };
    /**
     * Difference columns of the owning one-to-one and many-to-one columns.
     */
    SubjectChangedColumnsComputer.prototype.computeDiffRelationalColumns = function (allSubjects, subject) {
        // if there is no persisted entity then nothing to compute changed in it
        if (!subject.entity)
            return;
        subject.metadata.relationsWithJoinColumns.forEach(function (relation) {
            // get the related entity from the persisted entity
            var relatedEntity = relation.getEntityValue(subject.entity);
            // we don't perform operation over undefined properties (but we DO need null properties!)
            if (relatedEntity === undefined)
                return;
            // if there is no database entity then all relational columns are treated as new, e.g. changed
            if (subject.databaseEntity) {
                // here we cover two scenarios:
                // 1. related entity can be another entity which is natural way
                // 2. related entity can be just an entity id
                // if relation entity is just a relation id set (for example post.tag = 1)
                // then we create an id map from it to make a proper comparision
                var relatedEntityRelationIdMap = relatedEntity;
                if (relatedEntityRelationIdMap !== null && !(relatedEntityRelationIdMap instanceof Object))
                    relatedEntityRelationIdMap = relation.getRelationIdMap(relatedEntityRelationIdMap);
                // get database related entity. Since loadRelationIds are used on databaseEntity
                // related entity will contain only its relation ids
                var databaseRelatedEntityRelationIdMap = relation.getEntityValue(subject.databaseEntity);
                // if relation ids are equal then we don't need to update anything
                var areRelatedIdsEqual = EntityMetadata.compareIds(relatedEntityRelationIdMap, databaseRelatedEntityRelationIdMap);
                if (areRelatedIdsEqual)
                    return;
            }
            // if there is an inserted subject for the related entity of the persisted entity then use it as related entity
            // this code is used for related entities without ids to be properly inserted (and then updated if needed)
            var valueSubject = allSubjects.find(function (subject) { return subject.mustBeInserted && subject.entity === relatedEntity; });
            if (valueSubject)
                relatedEntity = valueSubject;
            // find if there is already a relation to be changed
            var changeMap = subject.changeMaps.find(function (changeMap) { return changeMap.relation === relation; });
            if (changeMap) {
                changeMap.value = relatedEntity;
            }
            else {
                subject.changeMaps.push({
                    relation: relation,
                    value: relatedEntity
                });
            }
        });
    };
    return SubjectChangedColumnsComputer;
}());
export { SubjectChangedColumnsComputer };

//# sourceMappingURL=SubjectChangedColumnsComputer.js.map
