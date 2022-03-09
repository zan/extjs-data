Ext.define('Zan.data.ViewModel', {
    extend: 'Ext.app.ViewModel',

    constructor: function(config) {
        this.callParent([config]);

        this._internalLinks = {};
    },

    /**
     * Overridden to intercept links that Ext doesn't support
     */
    setLinks: function(rawLinks) {
        var internalLinks = {};
        var extCompatibleLinks = {};

        // Find links with extra features like 'identifier' that need to be handled internally
        Ext.Object.each(rawLinks, function(key, value) {
            var extCompatible = true;

            if (value.identifier) extCompatible = false;

            if (extCompatible) {
                extCompatibleLinks[key] = value;
            } else {
                internalLinks[key] = value;
            }
        });

        // Start loading internal links
        setTimeout(Ext.bind(function() {
            this._loadLinks(internalLinks);
        }, this), 10);

        // Pass on any Ext-compatible links to the normal setter
        return this.callParent([ extCompatibleLinks ]);
    },

    _loadLinks: function(rawLinks) {
        // todo: better detection of binding and waiting for dependencies
        var zanRouteParams = this.get('zanRouteParams');
        if (!zanRouteParams) {
            console.error("FIXME: this relies on zanRouteParams being set");
            return;
        }

        Ext.Object.each(rawLinks, function(name, config) {
            var params = config.params || {};
            params.identifier = config.identifier;

            // todo: better detection and handling when identifier is bound to something
            if (Ext.String.startsWith(params.identifier, "{")) {
                var matches = params.identifier.match(/zanRouteParams.(\w+)}/);
                params.identifier = zanRouteParams[matches[1]];
            }

            // Load the model with the known parameters
            var modelPrototype = Ext.ClassManager.get(config.type);
            if (!modelPrototype) throw new Error("Invalid model class: " + config.type);

            modelPrototype.load(
                null,
                {
                    params: params,
                    success: function(record, opts) {
                        // Apply writeFields, if specified
                        if (!Ext.isEmpty(config.writeFields)) {
                            record.setWriteFields(config.writeFields);
                        }

                        // Update view model with the loaded record
                        this.set(name, record);
                    },
                    scope: this
                }
            );
        }, this);
    },
});