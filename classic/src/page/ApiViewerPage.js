Ext.define('Zan.data.page.ApiViewerPage', {
    extend: 'Zan.data.page.BasePage',

    requires: [
        'Zan.data.page.ApiViewerPageController',
        'Zan.data.panel.IframePanel',
        'Zan.data.page.apiViewer.ApiResponsePanel',
    ],

    controller: { xclass: 'Zan.data.page.ApiViewerPageController' },

    title: 'API Viewer',

    items: [
        {
            xtype: 'form',
            reference: 'form',
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            bodyPadding: 4,
            items: [
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                    },
                    items: [
                        {
                            xtype: 'combobox',
                            name: 'method',
                            fieldLabel: 'URL',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['name', 'value'],
                                data: [
                                    { name: 'GET',      value: 'GET' },
                                    { name: 'POST',     value: 'POST' },
                                    { name: 'PUT',      value: 'PUT' },
                                    { name: 'PATCH',    value: 'PATCH' },
                                ]
                            }),
                            valueField: 'value',
                            displayField: 'name',
                            editable: false,
                            bind: {
                                value: '{zanRouteParams.requestMethod}',
                            },
                        },
                        {
                            xtype: 'textfield',
                            name: 'url',
                            value: '/zan/doctrine/entity/',
                            bind: {
                                value: '{zanRouteParams.requestUrl}',
                            },
                            flex: 1
                        },
                    ]
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Parameters',
                    name: 'paramsText',
                    bind: {
                        value: '{zanRouteParams.requestData}',
                    },
                },
                {
                    xtype: 'checkboxfield',
                    fieldLabel: ' ',
                    labelSeparator: '',
                    boxLabel: 'Enable additional debug output if available',
                    name: 'zan_enableDebugging',
                    inputValue: true,
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: ' ',
                    labelSeparator: '',
                    items: [
                        {
                            xtype: 'button',
                            reference: 'doRequestButton',
                            text: 'Request',
                            scale: 'medium',
                            handler: 'onDoRequest',
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'tabpanel',
            margin: '8 0 0 0',
            flex: 1,
            items: [
                {
                    xclass: 'Zan.data.page.apiViewer.ApiResponsePanel',
                    title: 'Response',
                    reference: 'responsePanel',
                },
                {
                    xtype: 'zan-iframe',
                    title: 'SF Request Profiler',
                    reference: 'sfProfilerIframe',
                }
            ]
        }
    ]
});