/**
 * Represents a server-defined workflow
 *
 * todo: more docs on the format of "places" and "validGraphTransitions", should they be models?
 */
Ext.define('Zan.data.model.WorkflowModel', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'name', type: 'string', allowNull: true },
        { name: 'marking', type: 'string', allowNull: true },
        { name: 'places' },
        { name: 'validGraphTransitions' },
    ],

    // proxy: {
    //     type: 'zan-rest',
    //     //url: '/api/zan/drest/entity/{entityClassName}',
    //     //url: '/api/zan/drest/entity-workflow/Modules.PosterPrintingBundle.Entity.PosterPrintingRequest/LIBPO-1',
    //     url: '/api/zan/drest/entity-workflow',
    //     noCache: false, // true embeds the "_dc" cache buster, but this URL will always have a query string and won't be cached
    //     reader: {
    //         rootProperty: 'data',
    //     },
    // }
});