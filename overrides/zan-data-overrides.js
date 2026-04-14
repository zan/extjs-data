/**
 * This file contains additional customizations to Ext that cannot be done via inheritance or
 * through application configuration.
 */

/**
 * Add additional grid filterbar operators
 */
Ext.require('Ext.grid.plugin.filterbar.Operator', function(Operator) {
    Operator.addOperator('onday', 'x-fa fa-calendar-day', 'On Day');
    Operator.addOperator('notonday', 'x-fa fa-calendar-times', 'Not On Day');
});

/**
 * Add additional filter customizations
 */
Ext.require('Ext.util.Filter', function(Filter) {
    var prototype = Filter.prototype;

    /**
     * Custom operators functions to support client-side filtering
     *
     * NOTE: These methods execute in the context of an Ext.util.Filter, see that class for more information
     */
    prototype.operatorFns.onday = function(candidateRecord) {
        var filterVal = this._filterValue;
        var recordVal = this.getCandidateValue(candidateRecord, filterVal);

        if (!Ext.isDate(recordVal)) return false;
        if (!Ext.isDate(filterVal)) return false;
        
        return Ext.Date.clearTime(filterVal).getTime() === Ext.Date.clearTime(recordVal).getTime();
    };

    prototype.operatorFns.notonday = function(candidateRecord) {
        return !prototype.operatorFns.onday.call(this, candidateRecord);
    };
});