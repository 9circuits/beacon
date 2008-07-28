dojo.require("dojo.parser");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.Textarea");

function stopUpload(val) 
{
    document.getElementById('var').value = val;
    document.getElementById('cool').style.visibility = 'visible';
    return true;   
}

function checkNewForm(form) 
{
    var errors = '<p>Oops! You forgot to fill in something: O_O<br />';
    var ret = true;
    
    if (form.title.value == '') {
        errors += '- <span class="error">The Title Field is empty!</span><br />';
        ret = false;
    }
    if (form.author.value == '') {
        errors += '- <span class="error">The Author Field is empty!</span><br />';
        ret = false;
    }
    if (form.abstract.value == '') {
        errors += '- <span class="error">The Abstract Field is empty!</span><br />';
        ret = false;
    }
    if (form.date.value == '') {
        errors += '- <span class="error">The Date Field is empty!</span>';
        ret = false;
    }

    errors += '</p>';
    
    if (ret == false) {
        document.getElementById('message').innerHTML = errors;
    }
      
    return ret;
}

function checkEditForm(form)
{
    var errors = '';
    var ret = true;
    
    if (form.xmlf.value == '') {
        errors = '<p><span class="error">Oops! You forgot to select a file! O_O</span><p>';
        ret = false;
    } else if (checkFile(form.xmlf.value) == -1) {
        errors = '<p><span class="error">Oops! Wrong type of file! XML files only! O_O</span><p>';
        ret = false;
    }
        
    if (ret == false) {
        document.getElementById('message').innerHTML = errors;
        document.getElementById('cool').style.visibility = 'hidden';
    }
    else
        document.getElementById('message').innerHTML = '<p>If you can see the preview below then press Go! to continue: </p>';
        
    return ret;
}

function checkFile(string) 
{
    return string.lastIndexOf(".xml");
}









