<?php

$theXML = DOMDocument::load('xml/default-config.xml');
$metadata = $theXML->getElementsByTagName('metadata');
$metadata = $metadata->item(0);
$fields = $metadata->getElementsByTagName('field');

?>

<div id="newform">
	<form enctype="multipart/form-data" name="editform" action="ajax/new.php" method="POST">
		<input type="hidden" name="isnew" value="1"/>
		
        <table>
        <?php
            for ($i = 0; $i < $fields->length; $i++) {
                $field = $fields->item($i);
                $icon = $field->getAttribute('icon');
                $guide = $field->getAttribute('guide');
                $label = $field->getAttribute('label');
                $fnote = $field->getAttribute('fnote');
                $caption = $field->getAttribute('caption');
                
				echo '<tr>';
				echo '<td  colspan="2">'.($i+1).'. '.$caption.'. '.$fnote.'</td></tr>';
                echo "\n<tr>";
                echo "\n\t<td>".'<img src="images/'.$icon.'"/></td>';
                
                switch ($guide) {
                case 'abstract' : echo '<td><textarea name="'.$guide.'" style="width:300px; height:100px;">Enter abstract here.</textarea></td>'; 
                                  break;
				case 'date'		: echo '<td><input type="text" name="'.$guide.'" value="2008-12-12" /></td>';
								break;
				case 'author'	: echo '<td><input type="text" name="'.$guide.'" value="Author" /></td>';
								break;
				case 'title'	: echo '<td><input type="text" name="'.$guide.'" value="Title" /></td>';
								break;
                }
                
                
                echo "\n</tr>";

				

				echo '<tr><td colspan="2"><hr /></td</tr>';
				
            }
        ?>
		<tr><td align="center" colspan ="2"><input class="button" type="submit" value="Go!"></td></tr>

        </table>

    </form>

</div>

