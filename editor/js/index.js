var isnewmenu = false;
var iseditmenu = false;
var isgobutton = false;
var isloading = false;

processForm = function() {
            
    isloading = true;
    hideElement('gobox');

    if (isnewmenu) {
        var dontSubmit = false;
        var values = new Array(useFields.length);
        var errors = new Array(useFields.length);
        for (var i = 0; i < useFields.length; i++) {
            hideElement(useFields[i].guide + 'error');
            values[i] = document.newform.elements[useFields[i].guide].value;
            if(isEmpty(strip(values[i]))) {
                errors[i] = true;
            } else {
                errors[i] = false;
            }
        }
                
        var dateReg = /^(19|20)\d\d\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
        if (!dateReg.test(values[3])) {
            errors[3] = true;
        }

        for (var i = 0; i < errors.length; i++) {
            if(errors[i]) {
                showElement(useFields[i].guide + 'error');
                dontSubmit = true;
            }
        }

        if(dontSubmit) {
            isloading = false;
            showElement('gobox');    
        } else {
            shrink('centre'); shrink('newbox'); shrink('newmenu'); shrink('editbox'); showElement('loading');
            setTimeout("document.newform.submit()", 1000);
        }                            
    } else if (iseditmenu) {
        shrink('centre'); shrink('editbox'); shrink('editmenu'); shrink('newbox'); showElement('loading');
        setTimeout("document.editform.submit()", 1000);
    }
}

checkGoBox = function() {
    if ((isnewmenu || iseditmenu) && !isgobutton) {
        grow('gobox');
        isgobutton = true;
    } else if(!(isnewmenu || iseditmenu)) {
        shrink('gobox');
        isgobutton = false;
    }
}

slideNew = function() {
    if (isloading) return false;

    if (isnewmenu) {
        slideUp('newmenu');
        isnewmenu = false;
        document.newform.reset();
    } else {
        slideDown('newmenu');
        isnewmenu = true;
    }
    
    if (iseditmenu) {
        slideUp('editmenu');
        iseditmenu = false;
        document.editform.reset();
    }
    
    checkGoBox();
    return false;
}

slideEdit = function() {
    if (isloading) return false;

    if (iseditmenu) {
        slideUp('editmenu');
        iseditmenu = false;
        document.editform.reset();
    } else {
        slideDown('editmenu');
        iseditmenu = true;
    }
    
    if (isnewmenu) {
        slideUp('newmenu');
        isnewmenu = false;
        document.newform.reset();
    }
    
    checkGoBox();
    return false;
} 

connect('newbox', 'onclick', slideNew);
connect('newclose', 'onclick', slideNew);
connect('editbox', 'onclick', slideEdit);
connect('editclose', 'onclick', slideEdit);
connect('gobox', 'onclick', processForm);

hideElement('newmenu');
hideElement('editmenu');
hideElement('gobox');
hideElement('loading');

roundElement('newmenu');
roundElement('editmenu');
roundElement('centre');
roundElement('newbox');
roundElement('editbox');
roundElement('gobox');

map(hideElement, getElementsByTagAndClassName(null, 'error'));
