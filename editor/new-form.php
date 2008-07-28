<?php

$beaconDoneLoad = false;

$errors = "<p>Following Errors Occured:</p>";

if (file_exists(dirname(__FILE__).'/conf')) {
    require_once dirname(__FILE__).'/conf';
    $beaconDoneLoad = true;
}
else {
    $errors .= "<p>- <code>conf</code> file not found. Please create one.</p>";
    $beaconDoneLoad = false;
}

if (file_exists(dirname(__FILE__).'/i18n/'.$conflang.'.xml')) {
    $theXML = DOMDocument::load(dirname(__FILE__).'/i18n/'.$conflang.'.xml');
    $beaconDoneLoad = true;
}
else {
    $errors .= "<p>- <code>i18n/".$conflang.".xml</code> file not found. Please get your translated XML copy.</p>";
    $beaconDoneLoad = false;
}

if (!$beaconDoneLoad) {
    echo $errors;
    return false;
}

$metadata = $theXML->getElementsByTagName('newform');
$metadata = $metadata->item(0);
$goLabel = $metadata->getAttribute('goLabel');
$fields = $metadata->getElementsByTagName('field');

?>

<div id="newform">
	<form enctype="multipart/form-data" name="editform" action="ajax/new.php" method="POST" onsubmit="return checkNewForm(this);">
		<input type="hidden" name="isnew" value="1"/>
		
        <table>
            <tr><td id="message" colspan="2"><p>Please fill in the following details: </p></td></tr>
        <?php
            for ($i = 0; $i < $fields->length; $i++) {
                $field = $fields->item($i);
                $icon = $field->getAttribute('icon');
                $guide = $field->getAttribute('guide');
                $label = $field->getAttribute('label');
                $fnote = $field->getAttribute('fnote');
                $caption = $field->getAttribute('caption');
                
				echo '<tr>';
				echo '<td  colspan="2"><span class="field">'.($i+1).'. '.$caption.'. '.$fnote.'</td></tr>';
                echo "\n<tr>";
                echo "\n\t<td>".'<img src="images/'.$icon.'"/></td>';
                
                switch ($guide) {
                case 'abstract' : echo '<td><textarea class="textfield" name="'.$guide.'" style="width:400px; height:150px;">'.$label.'</textarea></td>'; 
                                  break;
				case 'date'		: echo '<td><input class="textbox" type="text" name="'.$guide.'" value="2008-12-12" /></td>';
								  break;
				case 'author'	: echo '<td><input class="textbox" type="text" name="'.$guide.'" value="'.$label.'" /></td>';
								  break;
				case 'title'	: echo '<td><input class="textbox" type="text" name="'.$guide.'" value="'.$label.'" /></td>';
								  break;
                }
                
                
                echo "\n</tr>";

				echo '<tr><td colspan="2"><hr /></td</tr>';
				
            }
        ?>
		<tr><td align="center" colspan ="2"><input class="gbutton" type="submit" value="<?php echo $goLabel; ?>"></td></tr>

        </table>

    </form>

</div>

