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
 * ### Saving models
 *
 * See Zan.data.writer.EntityWriter for more details on how EntityModels are serialized to json
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

    constructor: function() {
        this._dirtyAssociations = [];

        this.callParent(arguments);
    },

    /**
     * Returns true if fieldName is editable by the current user
     */
    isFieldEditable: function(fieldName) {
        return Ext.Object.getKey(this.get('_editableFields'), fieldName) !== null;
    },

    trackDirtyAssociations: function(toTrack) {
        // todo: exception when told to track an association that doesn't exist?
        toTrack = toTrack || [];

        Ext.Object.each(this.associations, function(key, association, obj) {
            // Check if we're limiting to a specific set of associations
            if (toTrack.length > 0 && !Ext.Array.contains(toTrack, key)) return true; // continue

            var assocField = this.zanGet(key);

            // Store - listen for data changed
            if (assocField instanceof Ext.data.Store) {
                // Flag this association as dirty when anything in the store changes
                assocField.on('datachanged', function() {
                    this._dirtyAssociations.push(key);
                }, this);
            }
        }, this);
    },

    /**
     * Returns true if any association should be considered dirty
     *
     * This method checks associations in the "hasMany" section. Association in the "fields section are handled as
     * expected by Ext's isDirty() method.
     */
    isAnyAssociationDirty: function() {
        return this.getDirtyAssociations().length > 0;
    },

    /**
     * Returns an array of associations that should be considered dirty
     *
     * Returned data is the raw Ext association information
     *
     * @returns {*[]}
     */
    getDirtyAssociations: function() {
        var dirty = [];

        Ext.Object.each(this.associations, function(key, association, obj) {
            if (Ext.Array.contains(this._dirtyAssociations, key)) {
                dirty.push(association);
            }
        }, this);

        return dirty;
    },

    /**
     * This method is called by the reader when the model is loaded from remote data
     *
     * https://docs.sencha.com/extjs/7.5.0/classic/Ext.data.Model.html#method-onLoad
     */
    onLoad: function() {

    },

    /**
     * OVERRIDDEN to clear out dirty associations once the model has been saved
     */
    save: function(options) {
        options = options || {};

        var clearDirtyAssociationsFn = Ext.bind(function() {
            this._dirtyAssociations = [];
        }, this);

        // Hook into the existing success handler if one was specified
        if (options.success) {
            Ext.Function.interceptAfter(options, 'success', clearDirtyAssociationsFn, this);
        }
        // If there's no existing success handler, set our own
        else {
            options.success = clearDirtyAssociationsFn;
        }

        return this.callParent([options]);
    },

    /**
     * Performs a save() call and returns a promise
     */
    promisedSave: async function(options) {
        options = options || {};
        var deferred = new Ext.Deferred();

        // Hook into the existing success handler if one was specified
        if (options.success) {
            Ext.Function.interceptAfter(options, 'success', function(record, operation) {
                deferred.resolve(record);
            });
        }
        // If there's no existing success handler, set our own
        else {
            options.success = function(record, operation) {
                deferred.resolve(record);
            };
        }

        // todo: reject on failure

        this.save(options);

        return deferred.promise;
    },

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
     * todo: better name would be 'resolve'? leave as 'zan' to indicate it's not a native Ext method?
     * @param fieldName
     * @returns {*}
     */
    zanGet(fieldName) {
        // Note that if an association is defined in the 'fields' section it will appear in both fieldsMap and associations
        var field = this.fieldsMap[fieldName];
        var association = this.associations[fieldName];

        if (!field && !association) {
            setTimeout(function() {
                console.log("Fields: %o", this.fieldsMap);
                console.log("Associations: %o", this.associations);
            }, 10);
            throw new Error("Field '" + fieldName + "' does not exist on " + this.$className);
        }

        if (field) {
            // Some fields are also associations
            if (field.reference) {
                return this[field.reference.getterName]();
            }
            // Delegate to typical getter
            else {
                return this.get(fieldName);
            }
        }
        if (association) {
            return this[association.getterName]();
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

    //todo: may not be necessary if form updateRecord() can be smarter?
    // privates: {
    //     isEqual(lhs, rhs) {
    //         console.log("[isEqual] %o / %o", lhs, rhs);
    //         var retVal = this.callParent([lhs, rhs]);
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