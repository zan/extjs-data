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

    /**
     * Gets the value of fieldOrAssociation from record
     *
     * This method will return the following:
     *  - For normal model fields, this returns the same as record.get('field')
     *  - For "to one" associations, it returns a model
     *  - For "to many" associations it returns a store
     *
     * @param {Ext.data.Model} record
     * @param {string} fieldOrAssociation
     * @returns {*}
     */
    getValue: function(record, fieldOrAssociation) {
        // Note that if an association is defined in the 'fields' section it will appear in both fieldsMap and associations
        var field = record.fieldsMap[fieldOrAssociation];
        var association = record.associations[fieldOrAssociation];

        if (!field && !association) {
            setTimeout(function() {
                console.log("Fields: %o", this.fieldsMap);
                console.log("Associations: %o", this.associations);
            }, 10);
            throw new Error("Field '" + fieldOrAssociation + "' does not exist on " + record.$className);
        }

        if (field) {
            // Some fields are also associations
            if (field.reference) {
                return record[field.reference.getterName]();
            }
            // Delegate to typical getter
            else {
                return record.get(fieldOrAssociation);
            }
        }
        if (association) {
            return record[association.getterName]();
        }
    },

    _resolveEntityValue: function(value) {
        if (value instanceof Ext.data.Model) {
            return value.getId();
        }

        return value;
    }
});