Ext.define('Zan.data.workflow.WorkflowProgressIndicator', {
    extend: 'Ext.panel.Panel',

    requires: [
        // todo: sencha app build fails if this is required from here
        //'Zan.data.model.WorkflowModel',
    ],

    config: {
        workflow: null,
    },

    layout: {
        type: 'hbox',
        pack: 'center',
    },
    items: [],

    /**
     * @param {Zan.data.model.WorkflowModel} workflow
     */
    updateWorkflow: function(workflow) {
        this.removeAll();

        var items = [];
        Ext.Array.forEach(workflow.get('places'), function(item) {
            var placeLabel = Zan.common.util.Format.snakeCaseToTitleCase(item.name);
            var isInThisState = workflow.get('marking') === item.name;

            // Check hideFromProgress unless we're in the state
            if (!isInThisState && item.hideFromProgress) return true;

            var html = placeLabel;
            if (isInThisState) {
                html = '<b>' + html + '</b>';
            }

            items.push({
                xtype: 'container',
                html: html,
                margin: '0 5 0 5',
            });
        }, this);

        this.add(items);
    }
});