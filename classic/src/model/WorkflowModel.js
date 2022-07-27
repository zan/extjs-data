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

        /*
            An object with the following properties:
                id - the internal ID of the entity associated with this workflow
                namespace - fully-qualified namespace of the entity
                version - current entity version
                workflowStatus - the current place in the workflow

            See zan/doctrine-rest-bundle/src/Response/WorkflowResponse.php
         */
        { name: 'entity' },
    ],
});