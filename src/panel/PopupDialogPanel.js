/**
 * todo: clicking 'X' in upper right should also call the cancelFn
 */
Ext.define('Zan.panel.ModalPopupDialogPanel', {
    extend: 'Ext.panel.Panel',

    config: {
        /**
         * @cfg {function} Function to call when OK is pressed
         *
         * Return false to leave the popup open
         * todo Return an Ext.deferred to set the form's state to "loading" until it resolves
         *
         * todo: document arguments correctly
         * Arguments:
         *  {Zan.Panel.ModalPopupDialogPanel} panel
         */
        okFn: null,

        /**
         * @cfg {function} Function to call when OK is pressed
         *
         * Return false to leave the popup open
         * todo Return an Ext.deferred to set the form's state to "loading" until it resolves
         *
         */
        cancelFn: null,

        /**
         * @cfg {boolean} If true, include a "Cancel" button that closes the popup
         */
        showCancelButton: true,

        /**
         * @cfg {*} scope to use when calling functions
         */
        scope: null,
    },

    // Set defaults for parent class
    floating: true,
    closable: true,
    resizable: true,
    draggable: true,
    modal: true,
    autoShow: true,

    minHeight: 200,
    minWidth: 200,

    initComponent: function () {
        this.callParent(arguments);

        if (!this.getOkFn()) {
            this.setOkFn(() => {
                return true;
            });
        }

        if (!this.getCancelFn()) {
            this.setCancelFn(() => {
                return true;
            });
        }

        // todo: remove this and use 'items'
        this.add(this._buildChildComponents());

        // todo: remove this and use 'bbar'?
        // https://docs.sencha.com/extjs/7.3.1/classic/Ext.grid.Panel.html#cfg-bbar
        this.addDocked(this._buildDockedItems());
    },

    _buildChildComponents: function() {
        var components = [];



        return components;
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
                    handler: function() {
                        var r = this.getOkFn().call(this.getScope() || this, this);
                        console.log("ok handler returned: %o", r);
                        if (r === false) return;

                        this.close();
                    },
                    scope: this
                },
                {
                    xtype: 'button',
                    text: 'Cancel',
                    scale: 'medium',
                    margin: '0 0 0 10',
                    hidden: !this.getShowCancelButton(),
                    handler: function() {
                        var r = this.getCancelFn().call(this.getScope() || this, this);

                        if (r === false) return;

                        this.close();
                    },
                    scope: this
                }
            ]
        });

        return docked;
    }
});