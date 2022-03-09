/**
 * Copied from Ext.ux.IFrame
 *
 * WARNING: This class needs additional testing + fixing before it's used in production
 *
 * See: https://docs.sencha.com/extjs/7.3.1/classic/src/IFrame.js.html
 *      https://docs.sencha.com/extjs/7.3.1/classic/Ext.ux.IFrame.html
 */
Ext.define('Zan.data.panel.IframePanel', {
    extend: 'Ext.Component',

    alias: 'widget.zan-iframe',

    loadMask: 'Loading...',

    config: {
        src: 'about:blank',
    },

    renderTpl: [
        // eslint-disable-next-line max-len
        '<iframe src="{src}" id="{id}-iframeEl" data-ref="iframeEl" name="{frameName}" width="100%" height="100%" frameborder="0"></iframe>'
    ],

    childEls: ['iframeEl'],

    initComponent: function() {
        this.callParent();

        this.frameName = this.frameName || this.id + '-frame';
    },

    /**
     * OVERRIDDEN by adean to handle cases where load() is called before the iframe is rendered
     * See load() for more details
     */
    afterRender() {
        this.callParent(arguments);

        if (this._pendingLoadSrc) {
            this.load(this._pendingLoadSrc);
            this._pendingLoadSrc = null;
        }
    },

    initEvents: function() {
        var me = this;

        me.callParent();
        me.iframeEl.on('load', me.onLoad, me);
    },

    initRenderData: function() {
        return Ext.apply(this.callParent(), {
            src: this.src,
            frameName: this.frameName
        });
    },

    getBody: function() {
        var doc = this.getDoc();

        return doc.body || doc.documentElement;
    },

    getDoc: function() {
        try {
            return this.getWin().document;
        }
        catch (ex) {
            return null;
        }
    },

    getWin: function() {
        var me = this,
            name = me.frameName,
            win = Ext.isIE ? me.iframeEl.dom.contentWindow : window.frames[name];

        return win;
    },

    getFrame: function() {
        // modified by adean: me.iframeEl doesn't appear to be set, maybe a pre-7.x way of doing things?
        return document.getElementById(this.id + '-iframeEl');
        var me = this;


        return me.iframeEl.dom;
    },

    onLoad: function() {
        var me = this,
            doc = me.getDoc();

        if (doc) {
            this.el.unmask();
            this.fireEvent('load', this);

        }
        else if (me.src) {

            this.el.unmask();
            this.fireEvent('error', this);
        }

    },

    load: function(src) {
        // added by adean: this cannot be called until the iframe is rendered because the "frame" element hasn't
        // been created yet
        // If this hasn't been rendered yet, retry this call when it is rendered
        if (!this.rendered) {
            // See afterRender() for where this is checked
            this._pendingLoadSrc = src;
            return;
        }

        var me = this,
            text = me.loadMask,
            frame = me.getFrame();

        if (me.fireEvent('beforeload', me, src) !== false) {
            if (text && me.el) {
                me.el.mask(text);
            }

            frame.src = me.src = (src || me.src);
        }
    },

    updateSrc: function(value) {
        this.load(value);
    },
});

/*
 * Note: Event relayers are not needed here because the combination of the gesture system and
 * normal focus/blur will handle it.
 * Tested with the examples/classic/desktop app.
 */

/*
 * TODO items:
 *
 * Iframe should clean up any Ext.dom.Element wrappers around its window, document
 * documentElement and body when it is destroyed.  This helps prevent "Permission Denied"
 * errors in IE when Ext.dom.GarbageCollector tries to access those objects on an orphaned
 * iframe.  Permission Denied errors can occur in one of the following 2 scenarios:
 *
 *     a. When an iframe is removed from the document, and all references to it have been
 *     removed, IE will "clear" the window object.  At this point the window object becomes
 *     completely inaccessible - accessing any of its properties results in a "Permission
 *     Denied" error. http://msdn.microsoft.com/en-us/library/ie/hh180174(v=vs.85).aspx
 *
 *     b. When an iframe is unloaded (either by navigating to a new url, or via document.open/
 *     document.write, new html and body elements are created and the old the html and body
 *     elements are orphaned.  Accessing the html and body elements or any of their properties
 *     results in a "Permission Denied" error.
 */