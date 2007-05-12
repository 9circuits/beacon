function DragAndDrop(control) {
    var id = MochiKit.DOM.getNodeAttribute(control, 'id');
    var dnd = new dojo.dnd.HtmlDragSource(dojo.byId(id), id);
    dnd.dragClass = 'dragControl';
}

var controls = MochiKit.DOM.getElementsByTagAndClassName(null, 'control');

MochiKit.Visual.roundElement('savebox');
MochiKit.Base.map(DragAndDrop, controls);
