/**
 * ### Events
 *
 * beforesave - fires before the record is saved to the server
 *      Returning false will prevent the record from being saved
 *      arguments:
 *          form - this form
 *          record - the record that is about to be saved
 *
 * save - fires after the record has been saved to the server
 *      Returning false will prevent further handlers from being called
 *      arguments:
 *          form - this form
 *          record - the record that was saved
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
         * Arguments:
         *  {Zan.common.view.PopupDialogPanel} panel
         */
        handler: null,

        /**
         * @cfg {function} Function to call when OK is pressed
         *
         * Return false to leave the popup open
         * todo Return an Ext.deferred to set the form's state to "loading" until it resolves
         *
         */
        cancelHandler: null,

        /**
         * @cfg {*} scope to use when calling functions
         */
        scope: null,

        /**
         * @cfg {boolean} If true, call save() on the record when the form is valid and "OK" is clicked
         */
        autoSaveRecord: false,

        /**
         * @cfg {object} If present and autoSaveRecord is true, these options will be sent to the server when saving
         */
        saveOptions: null,

        /**
         * @cfg {function} If autoSaveRecord is true this handler will be called after a successful save
         *
         * Arguments:
         *  {Zan.common.view.PopupDialogPanel} panel
         *  {Ext.data.Model} record that was saved
         */
        afterSaveHandler: Ext.emptyFn,
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
    bodyPadding: 4,

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
                    reference: 'okButton',
                    text: 'OK',
                    scale: 'medium',
                    handler: async function(button) {
                        if (!this.isValid(this)) return;

                        if (this.getAutoSaveRecord() && this.getRecord()) {
                            // note: defined in RecordFormMixin
                            this.updateRecord(this.getRecord());

                            var saveOptions = this.getSaveOptions() || {};
                            saveOptions = Ext.applyIf(saveOptions, {
                                failure: function() {},
                            });

                            Ext.Function.interceptAfter(saveOptions, 'failure', function(record, operation) {
                                button.setLoading(false);
                            });

                            if (!this.fireEvent('beforesave', this, this.getRecord())) {
                                return;
                            }

                            try {
                                this._indicateLoading();
                                await Zan.data.util.ModelUtil.save(this.getRecord(), saveOptions);

                                if (!this.fireEvent('save', this, this.getRecord())) {
                                    return;
                                }
                            } catch (e) {
                                this._clearLoading();

                                // NOTE: 'failure' interceptor defined above is also called
                                if (e instanceof ZanDataApiError) {
                                    Zan.data.Api.displayApiError(e);
                                    return false;
                                }
                                else {
                                    throw(e);
                                }
                            }

                            this.getAfterSaveHandler().call(this.getScope() || this, this, this.getRecord());
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
                    reference: 'cancelButton',
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

    _indicateLoading: function() {
        var okButton = this.lookup('okButton');
        var cancelButton = this.lookup('cancelButton');

        okButton.setText('');
        okButton.setIconCls('x-fa fa-spinner fa-spin');
        okButton.disable();

        cancelButton.disable();
    },

    _clearLoading: function() {
        var okButton = this.lookup('okButton');
        var cancelButton = this.lookup('cancelButton');

        okButton.setText('OK');
        okButton.setIconCls('');
        okButton.enable();

        cancelButton.enable();
    },

    /**
     * This method is overridden because specifying Ext.emptyFn in the config section prevents child classes
     * from overriding this method by implementing it in the class.
     *
     * @returns {function}
     */
    getHandler: function() {
        if (!this.handler) return Ext.emptyFn;

        return this.handler;
    },

    /**
     * This method is overridden because specifying Ext.emptyFn in the config section prevents child classes
     * from overriding this method by implementing it in the class.
     *
     * @returns {function}
     */
    getCancelHandler: function() {
        if (!this.cancelHandler) return Ext.emptyFn;

        return this.cancelHandler;
    },
});