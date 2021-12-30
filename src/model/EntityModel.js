/**
 * todo: should be BaseEntityModel
 *
 * ### Using entity models from the console
 *
 * Load a model:
 *
 *   var u = App.model.UserModel.load(4);
 *
 * Load a model with additional parameters:
 *
 *   var u = App.model.StowersUserModel.load(4, { params: { responseFields: ['defaultDepartment'] } });
 *
 *
 * Accessing associations:
 *
 *   var u = App.model.StowersUserModel.load(4, { params: { responseFields: ['defaultDepartment'] } });
 *   // Wait for the model to load
 *   u.getDefaultDepartment();
 *
 */
Ext.define('Zan.data.model.EntityModel', {
    extend: 'Ext.data.Model',

    requires: [
        'Zan.data.field.Boolean',
        'Zan.data.field.Integer',
        'Zan.data.field.String',
        'Zan.data.model.WorkflowModel'
    ],

    fields: [
        // If true, this record can be edited. See Zan.data.reader.EntityReader for where this is calculated
        // todo: should this really be a field? can it be an object property?
        { name: '_isEditable', type: 'bool', allowNull: true, persist: false, },
        { name: '_editableFields', type: 'auto', default: {}, persist: false },
        { name: 'workflow', type: 'zan-association',
            reference: {
                type: 'Zan.data.model.WorkflowModel',
                role: 'workflow',
                unique: true,
            }
        }
    ],

    inheritableStatics: {
        /**
         * OVERRIDDEN to provide support for loading by string-based identifiers
         *
         * @param {int|string} id
         * @param {object} options
         * @param session
         * @returns {Zan.data.model.EntityModel}
         *
         * todo: is this necessary?
         */
        // load: function(id, options, session) {
        //     // Numeric ID can be processed as normal
        //     if (Ext.isNumeric(id)) {
        //         return this.callParent([id, options, session]);
        //     }
        //
        //     // For a string, the id should be sent as the 'identifier' parameter
        //     options = options || {};
        //     var data = {},
        //         rec;
        //
        //     if (session) {
        //         // todo: remove this or make it work with alternate identifiers
        //         rec = session.peekRecord(this, id);
        //     }
        //
        //     if (!rec) {
        //         rec = new this(data, session);
        //     }
        //
        //     options.params = Zan.Object.setDefaults(options.params, {
        //         identifier: id
        //     });
        //     rec.load(options);
        //
        //     return rec;
        // }
    },

    /**
     * Allows getting association values by their field name
     *
     *      record.zanGet('requester'); // returns User model from "requester" association
     *
     * @param fieldName
     * @returns {*}
     */
    zanGet(fieldName) {
        const field = this.getField(fieldName);

        // Association, use custom getter
        if (field.reference) {
            return this[field.reference.getterName]();
        }
        // Delegate to typical getter
        else {
            return this.get(fieldName);
        }
    },

    zanSet(fieldName, value) {
        const field = this.getField(fieldName);
        if (!field) return null;

        // Association, use custom setter
        if (field.reference) {
            return this[field.reference.setterName](value);
        }
        // Delegate to typical setter
        else {
            return this.set(fieldName, value);
        }
    },

    /**
     * Returns true if fieldName is editable by the current user
     */
    isFieldEditable: function(fieldName) {
        return Ext.Object.getKey(this.get('_editableFields'), fieldName) !== null;
    },

    //todo: may not be necessary if form updateRecord() can be smarter?
    // privates: {
    //     isEqual(lhs, rhs, field) {
    //         console.log("[isEqual:%s] %o / %o", field, lhs, rhs);
    //         var retVal = this.callParent([lhs, rhs, field]);
    //
    //         // If both items are entity models, compare by ID
    //         if (lhs instanceof Zan.data.model.EntityModel && rhs instanceof Zan.data.model.EntityModel) {
    //             if (lhs.getId() === null || typeof lhs.getId() === 'undefined') return false;
    //             if (rhs.getId() === null || typeof rhs.getId() === 'undefined') return false;
    //
    //             if (Ext.getClassName(lhs) !== Ext.getClassName(rhs)) return false;
    //
    //             return lhs.getId() === rhs.getId();
    //         }
    //
    //         return retVal;
    //     },
    // }

});