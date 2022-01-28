Ext.define('Zan.data.page.DqlConsolePage', {
    extend: 'Zan.data.page.BasePage',

    title: 'DQL Console',

    controller: { xclass: 'Zan.data.page.DqlConsolePageController' },

    items: [
        // Top section
        {
            xtype: 'panel',
            layout: { type: 'hbox', align: 'stretch' },
            flex: 1,
            items: [
                // DQL / SQL tab panel
                {
                    xtype: 'tabpanel',
                    flex: 1,
                    items: [
                        {
                            xtype: 'panel',
                            title: 'DQL',
                            flex: 1,
                            items: [
                                {
                                    // todo: replace with nicer text editor
                                    xtype: 'textarea',
                                    reference: 'dqlTextArea',
                                    fieldLabel: 'Enter DQL',
                                    labelAlign: 'top',
                                    flex: 1,
                                    width: '100%',
                                    height: 200,
                                    value: 'select e from Modules\\PosterPrintingBundle\\Entity\\PosterPrintingRequest e'
                                },
                                {
                                    xtype: 'button',
                                    handler: 'onRunDqlClicked',
                                    text: 'Run',
                                },
                            ]
                        },
                        {
                            xtype: 'panel',
                            title: 'SQL',
                            items: [
                                {
                                    xtype: 'container',
                                    html: 'Generated SQL goes here...'
                                }
                            ]
                        },
                    ]
                },
                // Parameters / entity browser?
                {
                    xtype: 'panel',
                    title: 'Parameters',
                    html: 'parameters go here',
                },
            ],
        },
        // Bottom results grid
        {
            xtype: 'panel',
            title: 'Query Results',
            flex: 1,
        },
    ],
});