Ext.define('Zan.data.view.workflow.WorkflowButtonToolbarController', {
    extend: 'Ext.app.ViewController',

    init: function() {
        // Update buttons whenever the workflow changes
        this.getViewModel().bind('{entity.workflow}', function(value) {
            this.renderButtons(value);
        }, this);
    },

    /**
     * @param {Zan.data.model.WorkflowModel} workflow
     */
    renderButtons: function(workflow) {
        this.getView().removeAll();

        var items = [];
        Ext.Array.forEach(workflow.get('validGraphTransitions'), function(item) {
            var hidden = false;
            var disabled = false;
            var tooltip = null;

            if (item.blockers) {
                disabled = true;
                tooltip = [];
                Ext.Array.forEach(item.blockers, function(raw) {
                    tooltip.push('<span class="x-fa fa-exclamation-triangle"></span> ' + Ext.htmlEncode(raw.message));
                    if (raw.parameters) {
                        if (raw.parameters.hideTransition) hidden = true;
                    }
                });
                tooltip = tooltip.join("<br>");
            }

            items.push({
                xtype: 'button',
                text: item.label,
                margin: '0 5 0 5',
                hidden: hidden,
                disabled: disabled,
                tooltip: tooltip,
                handler: function(button) {
                    this.doTransition(item.name);
                },
                scope: this
            });
        }, this);

        this.getView().add(items);
    },

    doTransition: async function(transitionId) {
        // todo: fire "before" events and check for responses

        var entity = this.getView().getEntity();
        var entityClassName = Ext.ClassManager.get(entity.$className).entityClassName;

        // todo: this should be configurable
        var url = '/api/zan/drest/entity-workflow/' + entityClassName + '/' + entity.getId() + '/transition';

        await Zan.data.Api.post(url, { transition: transitionId });

        // Refresh the entity
        entity.load({
            params: { includeWorkflow: true }
        });

        // todo: fire "after" events
    }
});