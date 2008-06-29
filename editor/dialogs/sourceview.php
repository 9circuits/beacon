<script type="text/javascript">
document.getElementById("source").value = document.getElementById("design").contentWindow.document.body.innerHTML;
editAreaLoader.init({
	id: "source"	// id of the textarea to transform		
	,start_highlight: true	// if start with highlight
	,allow_resize: "no"
	,allow_toggle: false
	,language: "en"
	,syntax: "brainfuck"	
});
</script>
<div id="box" style="text-align: center;">
	<p class="header">Source View</p>
		<table class="form">
			<tr><td colspan="2"><textarea id="source" style="width: 760px; height: 450px;"></textarea></td></tr>

			<tr><td align="center"><a href="#" id="update" class="lbAction" rel="deactivate">Update</a></td></tr>
		</table>
</div>