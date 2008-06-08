<div id="editform">
	<form enctype="multipart/form-data" name="editform" action="ajax/new.php" method="POST">
		<input type="hidden" name="isedit" value="1"/>
	    <input type="hidden" name="MAX_FILE_SIZE" value="102400"/>
		<table>
			<tr><td colspan="2">Select a file:</td></tr>
	          	<tr><td><img src="images/new.png"></td>
				<td><input name="xmlf" type="file"/></td></tr>
			<tr><td colspan="2"><hr /></td</tr>
			<tr><td align="center" colspan="2"><input class="button" type="submit" value="Go!"></td></tr>
		</table>
	 </form>
</div>
