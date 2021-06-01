/**
 *
 */
Ext.define('Zan.data.util.Format', {
    singleton: true,

    /**
     * todo: docs
     * @param {mixed} value
     * @returns {string}
     */
    asString: function(value) {
        // Edge cases / easy cases
        if (Ext.isEmpty(value)) return '';
        if (Ext.isString(value)) return value;

        // todo: allow site to customize via DIC
        if (Ext.isDate(value)) {
            return Ext.Date.format(value, 'Y-m-d H:i:s');
        }

        // If nothing else applies, cast to a string
        // Note that for objects this will call their toString(), if defined
        return value + '';
    },
});