/**
 * ### Permissions integration
 *
 * Set the includePermissionsMetadata to true to enable permissions integration
 *
 * When a response comes back from the server, each record will have information on whether it can be edited.
 * In addition, the _canCreateEntities property will indicate whether the logged in user is able to create new entities
 *
 * Note that this requires at least one load call to fire since it retrieves this information from the server.
 *
 */
Ext.define('Zan.data.store.EntityStore', {
    extend: 'Ext.data.Store',

    alias: 'store.zan-entitystore',

    requires: [
        'Zan.data.reader.EntityReader',
        'Zan.data.util.EntityModelFinder',
    ],

    config: {
        /**
         * @cfg {boolean} If true, include metadata related to whether the record can be edited
         */
        includeEditabilityMetadata: false,

        /**
         * @cfg {boolean} If true, include metadata related to whether the record can be deleted
         */
        includeDeletabilityMetadata: false,

        /**
         * @cfg {boolean} If true, include metadata related to permissions (whether entities can be created/edited)
         */
        includePermissionsMetadata: false,

        /**
         * @cfg {Array} Additional fields to request from the API when loading this store
         */
        responseFields: null,

        /**
         * @cfg {object} If specified, these extra params are passed to the proxy
         */
        proxyExtraParams: null,
    },

    remoteSort: true,
    remoteFilter: true,
    pageSize: 100,

    constructor: function (config) {
        /*
            This exists to work around an issue where calling load() does not immediately set isLoading() to true
            By default, ext stores are "asynchronous" which means they slightly delay the load operation.
            If you call load() twice in a row on the same store you may see isLoading() as false on the second call
            See load() implementation: https://docs.sencha.com/extjs/7.3.1/classic/src/ProxyStore.js.html#Ext.data.ProxyStore-method-load
            As an alternative, you can set asynchronousLoad on the store: https://docs.sencha.com/extjs/7.3.1/classic/Ext.data.Store.html#cfg-asynchronousLoad
            EXT_VERIFY_AFTER_UPGRADE to see if it's fixed
         */
        this._zanIsLoading = false;

        // Bindable property that indicates whether or not the server allows creating new entities
        // Requires that includePermissionsMetadata is true
        // See _processMetadata for where this is updated
        this._canCreateEntities = false;

        if (!config.model) {
            throw("'model' is a required config parameter");
        }
        var modelClass = Ext.ClassManager.get(config.model);
        if (!modelClass) {
            throw new Error("Model class '" + config.model + "'was not valid. Ensure application has been built and this file has been required.");
        }

        this.callParent([config]);
    },

    load: function(options) {
        options = options || {};
        options.params = options.params || {};
        options.params.includeMetadata = options.params.includeMetadata || [];

        // pass 'responseFields' in params when parent store loads
        if (this.getResponseFields()) {
            options.params = Ext.apply(options.params, {
                responseFields: this.getResponseFields()
            });
        }

        if (this.getIncludeEditabilityMetadata()) {
            options.params.includeMetadata.push('editability');
        }
        if (this.getIncludeDeletabilityMetadata()) {
            options.params.includeMetadata.push('deletability');
        }
        if (this.getIncludePermissionsMetadata()) {
            options.params.includeMetadata.push('permissions');
        }

        // Listen for the response to this load command
        this.on('load', function(store, records, successful, operation, eOpts) {
            if (!successful) return;

            this._processMetadata(operation.getResponse());
        }, this, { single: true });

        return this.callParent([ options ]);
    },

    async ensureLoaded(source) {
        const deferred = new Ext.Deferred();

        // Already loaded: immediately resolve
        if (this.isLoaded()) {
            deferred.resolve();
        }
        // Loading: wait until it's finished and then resolve
        else if (this.isLoading() || this._zanIsLoading) {
            this.on(
                'load',
                () => {
                    deferred.resolve();
                },
                this,
                { single: true },
            );
        }
        // Not loaded yet: call load()
        else {
            this._zanIsLoading = true;
            this.load({
                callback: function(records, operation, success) {
                    deferred.resolve();
                }
            });
        }

        return deferred.promise;
    },

    updateProxyExtraParams: function(params) {
        var proxy = this.getProxy();

        Ext.Object.each(params, function(key, value) {
            proxy.setExtraParam(key, value);
        }, this);
    },

    _processMetadata: function(response) {
        var responseJson = response.responseJson;

        // Nothing to do if there's no metadata
        if (!responseJson || !Ext.isObject(responseJson.metadata)) return;

        var metadata = responseJson.metadata;

        this._canCreateEntities = !!metadata.canCreateEntities;
    },

    _getEntityIdForUrl: function(entityId) {
        // Replace backslashes with dots
        var forUrl = entityId.replace(/\\/g, '.');

        // Remove initial dot
        forUrl = Zan.String.removePrefix(forUrl, '.');

        return forUrl;
    }
});
