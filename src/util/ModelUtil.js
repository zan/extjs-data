/**
 * Utility methods for working with models
 */
Ext.define('Zan.data.util.ModelUtil', {
    singleton: true,

    /**
     * Updates fieldName on record to newValue if newValue is not the same "entity value"
     *
     * "Entity values" are equivalent if they are represented the same way on the server.
     * For example, an integer 123 that represents a primary key is equivalent to a record where record.getId() returns 123
     */
    setIfDifferent: function(record, fieldName, newValue) {
        var recordValue = record.zanGet(fieldName);

        if (this.entityValueIsEqual(recordValue, newValue)) return;

        record.zanSet(fieldName, newValue);
    },

    /**
     * This method compares entity values from the perspective of a remote API
     *
     * For example, an integer "100" is considered equivalent to a model with an ID of "100"
     */
    entityValueIsEqual: function(a, b) {
        var entityValueA = this._resolveEntityValue(a);
        var entityValueB = this._resolveEntityValue(b);

        return entityValueA === entityValueB;
    },

    _resolveEntityValue: function(value) {
        if (value instanceof Ext.data.Model) {
            return value.getId();
        }

        return value;
    }
});