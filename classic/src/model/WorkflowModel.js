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
        /*
            todo: relationship / model?
            An array of objects with properties:
                name
                froms -> string[] transition names
                tos -> string[] transition names
                blockers -> array of objects with properties
                    code
                    message
                    parameters -> object with properties
         */
        { name: 'validGraphTransitions' },
    ],
});