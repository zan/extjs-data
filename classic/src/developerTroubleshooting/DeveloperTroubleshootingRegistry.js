/**
 * Tracks singleton classes that provide troubleshooting information
 *
 * To implement a troubleshooter:
 *
 * 1. Create a singleton class
 *
 * 2. Implement a getSuggestions() method:
 *      getSuggestions: function(context, details)
 *
 * 3. Register your singleton after it's created:
 *      Zan.data.developerTroubleshooting.DeveloperTroubleshootingRegistry.registerSuggester(this);
 *
 * See buildSuggestions() for documentation on the arguments to getSuggestions()
 */
Ext.define('Zan.data.developerTroubleshooting.DeveloperTroubleshootingRegistry', {
    singleton: true,

    constructor: function(config) {
        this._suggesters = [];
    },

    /**
     * Indicate that
     * @param suggester
     */
    registerSuggester: function(suggester) {
        this._suggesters.push(suggester);
    },

    /**
     * Known contexts:
     *
     * API_REQUEST - an HTTP API request
     *      Details:
     *          responseInfo - an object with the raw response from the server
     */
    buildSuggestions: function(context, details) {
        var html = '';
        var foundSuggestions = false;

        for (var i=0; i < this._suggesters.length; i++) {
            var suggestion = this._suggesters[i].getSuggestions(context, details);
            if (!suggestion) continue;

            foundSuggestions = true;
            html += suggestion;
        }

        if (foundSuggestions) return html;

        return 'No suggestions available';
    },
});