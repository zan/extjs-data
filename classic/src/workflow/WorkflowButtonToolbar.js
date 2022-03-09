/**
 *
 */
Ext.define('Zan.data.workflow.WorkflowButtonToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    requires: [
        'Zan.data.workflow.WorkflowButtonToolbarController',
    ],

    config: {
        entity: null,
    },

    controller: { xclass: 'Zan.data.workflow.WorkflowButtonToolbarController' },
    viewModel: {},

    // NOTE: items are dynamically built in the controller based on workflow data
});