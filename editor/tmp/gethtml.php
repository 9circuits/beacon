<?php

	
	$contents = file_get_contents(urldecode($_REQUEST['id']).".html");

	echo $contents;
	

?>