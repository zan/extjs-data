/**
 * 
 */
Ext.define('Zan.data.form.PopupFormPanel', {
    extend: 'Ext.form.Panel',

    requires: [
        'Zan.data.form.RecordFormMixin',
    ],

    mixins: {
        recordForm: 'Zan.data.form.RecordFormMixin',
    },

    config: {
        /**
         * @cfg {function} Function to call when OK is pressed and the popup is valid
         *
         * Return false to leave the popup open
         *
         * The popup is considered valid if isValid() returns true
         * todo Return an Ext.deferred to set the form's state to "loading" until it resolves
         *
         * todo: document arguments correctly
         * Arguments:
         *  {Zan.common.view.PopupDialogPanel} panel
         */
        handler: Ext.emptyFn,

        /**
         * @cfg {function} Function to call when OK is pressed
         *
         * Return false to leave the popup open
         * todo Return an Ext.deferred to set the form's state to "loading" until it resolves
         *
         */
        cancelHandler: Ext.emptyFn,

        /**
         * @cfg {*} scope to use when calling functions
         */
        scope: null,

        /**
         * @cfg {boolean} If true, call save() on the record when the form is valid and "OK" is clicked
         */
        autoSaveRecord: false
    },

    // Allow tracking references
    referenceHolder: true,

    // Set defaults for parent class
    floating: true,
    closable: true,
    resizable: true,
    draggable: true,
    modal: true,
    autoShow: true,

    minHeight: 200,
    minWidth: 200,

    // Form fields should fill full width of the popup
    layout: {
        type: 'vbox',
        align: 'stretch',
    },

    initComponent: function () {
        this.callParent(arguments);

        this.addDocked(this._buildDockedItems());
    },

    _buildDockedItems: function() {
        var docked = [];

        docked.push({
            xtype: 'panel',
            dock: 'bottom',
            bodyPadding: 8,
            layout: {
                type: 'hbox',
                pack: 'center',
            },
            items: [
                {
                    xtype: 'button',
                    text: 'OK',
                    scale: 'medium',
                    handler: async function(button) {
                        if (!this.isValid(this)) return;

                        if (this.getAutoSaveRecord() && this.getRecord()) {
                            this.updateRecord(this.getRecord());
                            button.setLoading("Saving...");
                            await Zan.data.util.ModelUtil.save(this.getRecord(), {
                                failure: () => { button.setLoading(false) },
                            });
                        }

                        var r = this.getHandler().call(this.getScope() || this, this);
                        if (r === false) return;

                        // todo: deferred support
                        this.close();
                    },
                    scope: this
                },
                {
                    xtype: 'button',
                    text: 'Cancel',
                    scale: 'medium',
                    margin: '0 0 0 10',
                    handler: function() {
                        var r = this.getCancelHandler().call(this.getScope() || this, this);

                        if (r === false) return;

                        this.close();
                    },
                    scope: this
                }
            ]
        });

        return docked;
    },

});