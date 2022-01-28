/**
 *
 */
Ext.define('Zan.data.view.workflow.WorkflowButtonToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    requires: [
        'Zan.data.view.workflow.WorkflowButtonToolbarController',
    ],

    config: {
        entity: null,
    },

    controller: { xclass: 'Zan.data.view.workflow.WorkflowButtonToolbarController' },
    viewModel: {},

    // NOTE: items are dynamically built in the controller based on workflow data
});