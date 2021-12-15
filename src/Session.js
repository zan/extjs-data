Ext.define('Zan.data.Session', {
    extend: 'Ext.data.Session',

    /**
     * Refreshes record data from the server
     *
     * @param {Ext.data.Model} record
     * @param {object} extraParams to pass with the load() call
     * @returns {Ext.promise}
     */
    refresh: function(record, extraParams) {
        var deferred = new Ext.Deferred();

        record.load({
            params: extraParams || {},
            scope: this,
            success: function(record, operation) {
                // Ensure the record is owned by the session
                this._ensureRecordInSession(record);

                deferred.resolve(record);
            },
            failure: function(record, operation) {
                console.error("Failed to refresh %o", record);
                deferred.reject("Failed to load record");
            }
        });

        return deferred.promise;
    },

    getRecordByAnyIdentifier: function(className, identifier, extraParams) {
        extraParams = extraParams || {};
        var deferred = new Ext.Deferred();

        if (!Ext.isEmpty(identifier)) {
            extraParams.identifier = identifier;
        }

        var record = Ext.create(className);
        return this.refresh(record, extraParams);
    },

    _ensureRecordInSession: function(record) {
        // todo: do we need this method? even catch the exception below still generates an error + trace in the console
        return;

        var exists = this.peekRecord(Ext.getClassName(record), record.getId());

        if (!exists) {
            // When loading nested records, such as a user with defaultDepartment and departments that contain the
            // same model this generates an exception
            // The peekRecord call above returns false, but this gives an error: Ext.data.Session.add(): Duplicate id 22 for App.model.DepartmentModel
            // todo: is this an Ext bug? find a workaround?
            try {
                this.adopt(record);
            } catch (ex) {}

        }
    }
});