<script type="text/javascript">
var gid = getVar('id');

// Add the missing style from the 
var style= '<<?php echo '\?'; ?>xml version="1.0" encoding="UTF-8"<?php echo '\?'; ?>><style type="text/css" media="all">';
style += '@import "../css/guide.css";';
style += '</style><body>';
var text = style+iframe.document.body.innerHTML+'</body>';

text = encodeURIComponent(text);

/* Thanks to the prototpye library AJAX is so much easier! XD */
var myAjax = new Ajax.Request(
"ajax/save.php", 
{
    method: 'post', 
    parameters: "id="+gid+"&text="+text, 
    onComplete: function() {
        document.getElementById("confirm").style.display = 'block';
        document.getElementById("loadingGif").style.display = 'none';
        document.getElementById("source").value = myAjax.transport.responseText;
    }
}
);
</script>

<div id="box" style="text-align: center;">
	<p class="header">Save</p>
    <div id="loadingGif" style="margin: 10px; width: 32px; height: 32px;">
        <table class="form">
            <tr><td><img src="images/loading.gif" width="32px" height="32px" border="none" /></td></tr>
            <tr><td><b>Saving Data...</b></td></tr>
        </table>
    </div>
    <div id="confirm" style="display:none;">
    <table class="form">
        <tr><td align="center">
            Saved!
        </td></tr>
        <tr><td align="center"> <a href="#" id="save" class="lbAction" rel="deactivate">Ok</a></td></tr>
    </table>
    </div>
</div>

