Ext.define('Zan.data.util.EntityModelFinder', {
    singleton: true,

    getModelClassFromEntityId: function(entityId) {
        // Load the active schema
        var schema = Ext.data.schema.Schema.get();

        var modelClass = null;
        schema.eachEntity(function(entityName) {
            var entity = schema.getEntity(entityName);

            if (entity.doctrineClassName === entityId) {
                modelClass = entityName;
            }
        });

        return modelClass;
    }
});