<?php

include "Storage.php";

class BeaconFlatFile implements BeaconStorage
{
    function BeaconFlatFile($path)
    {
        $this->path = $path;
    }

    private function updateFile($id, $content)
    {
        $fH = fopen($this->path . $id . ".html", "w+");
        fwrite($fH, $content);
        fclose($fH);

        return true;
    }

    public function createDocument($id, $content = false)
    {
        if ($content) {
            $this->updateFile($id, $content);
        }
    }

    public function updateDocument($id, $content)
    {
        return $this->updateFile($id, $content);
    }

    public function fetchDocument($id)
    {
        return file_get_contents($this->path . $id . ".html");
    }

    public function deleteDocument($id) {
        if (is_file($this->path . $id . ".html")) {
            unlink($this->path . $id . ".html");
            return true;
        } else {
            return false;
        }
    }
}

?>


