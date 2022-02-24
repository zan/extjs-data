Ext.define('Zan.data.panel.JsonViewPanel', {
    extend: 'Zan.data.view.panel.IframePanel',

    requires: [
        'Zan.common.Object',
    ],

    // todo: probably fails with production build
    src: '/packages/local/zan-data/resources/json-viewer/basic.html',

    constructor: function(config) {
        // How many levels to show - 2 covers the first level of data in a typical API reponse
        this._currentDepth = 2;
        // The maximum amount the json can be expanded. This is updated in loadJson
        this._maxDepth = this._currentDepth;

        // The data currently being displayed
        this._currentData = null;

        this.callParent([config]);
    },

    loadJson: function(jsonText) {
        var parsed = jsonText;

        // Convert text to an object, if necessary
        if (Ext.isString(jsonText)) parsed = JSON.parse(jsonText);

        this._currentData = parsed;
        this._maxDepth = Zan.common.Object.getMaxDepth(parsed);
        this._currentDepth = Math.min(this._maxDepth, this._currentDepth);

        this._refreshJson();
    },

    showMore: function() {
        // todo: add max depth check on this
        if (this._currentDepth < this._maxDepth) this._currentDepth++;

        this._refreshJson();
    },

    showLess: function() {
        if (this._currentDepth > 0) this._currentDepth--;

        this._refreshJson();
    },

    _refreshJson: function() {
        this.getWin().jsonViewer.showJSON(this._currentData, -1, this._currentDepth);
    },
});