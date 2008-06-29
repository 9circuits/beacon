<script type="text/javascript">
    var theSelection = iframe.getSelection();
    var theRange = theSelection.getRangeAt(0);
    var text = theRange.commonAncestorContainer;
    
    var allowed = new Array("guideParagraph", 
                            "guideList",
                            "guideNoteValue",
                            "guideWarnValue",
                            "guideImpoValue");
                            
    var path = checkNodePath(text, allowed);
    
    if (path!=null)
    {
        document.getElementById('linkCancel').style.display = 'none';
        document.getElementById('linkTable').style.display = 'block';
        document.getElementById('displayText').value = theSelection;
    }
</script>

<div id="box" style="text-align: center;">
	
	<p class="header">Add Link</p>
	
    <table class="form" id="linkCancel">
        <tr>
			<td>Sorry! You cannot add a link here!</td>
		</tr>
		<tr>
		    <td align="center">
		        <a id="addLink" class="lbAction" rel="deactivate">Ok</a>
		    </td>
		</tr>
    </table>
    
	<table id="linkTable" style="display: none;" class="form">
		<tr>
			<td>Text to be Displayed: </td>
			<td><input id="displayText" type="text" value=""/></td>
		</tr>
		<tr>
			<td>Url to be linked: </td>
			<td><input id="link" type="text" value="http://"/></td>
		</tr>

		<tr>
		    <td colspan="2" align="center">
		        <a id="addLink" class="lbAction" rel="deactivate">Add</a>
		    </td>
		</tr>
	</table>
	
</div>