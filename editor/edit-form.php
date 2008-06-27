<div id="editform">
	<form enctype="multipart/form-data" target="upload_target" name="editform" action="ajax/new.php" method="POST">
		<input type="hidden" name="isedit" value="1"/>
	    <input type="hidden" name="MAX_FILE_SIZE" value="102400"/>
		<table>
			<tr><td colspan="2">Select a file:</td></tr>
	          	<tr><td><img src="images/new.png"></td>
				<td><input name="xmlf" type="file"/></td>
				<td><input type="submit" value="Upload"></td></tr>
			<tr><td colspan="2"><hr /></td</tr>
				
		</table>
	 </form>
	<iframe id="upload_target" name="upload_target" style="width:575px; height: 250px; border:1px solid #000; "></iframe>
	
</div>

<div id="cool">
	<form enctype="multipart/form-data" name="editform" action="editor.php" method="GET">
		<input id="var" type="hidden" name="id" value="">
		<input class="button" type="submit" value="Go!">
	</form>
</div>

