<?php

class BeaconFlatFile implements BeaconStorage
{
	private function updateFile($id, $content)
	{
		$fH = fopen("tmp/$id", "w+");
		fwrite($fH, $content);
		fclose($fH);
		
		return true;
	}
	
	public function createDocument($content = false)
	{
		$id = tempnam('', null);
		if ($content) {
			updateFile($id, $content);
		}
		return $id;	
	}
	
	public function updateDocument($id, $content)
	{
		return updateFile($id, $content);
	}
	
	public function fetchDocument($id)
	{
		return file_get_contents("storage/tmp/$id");
	}
}

?>