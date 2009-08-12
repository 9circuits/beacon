<?
/**
* Beacon - API (PHP)
*
* Copyright (c) Beacon Dev Team
* Licensed under GPLv3
*
*/

class BeaconAPI
{
    function BeaconAPI($confFile, $fullPath, $request, $db) {
        $this->db = $db;

        $this->fullPath = $fullPath;

        $this->request = $request;

        $this->read_settings($confFile);

        $this->pages = include($this->i18npath . $this->settings->language . ".inc");
    }

    function fetchui() {
        // Get the localized UI
        $html = $this->localizeHTML("beaconui.html");

        $html = str_replace("{imgpath}", $this->settings->url . $this->settings->php->imagepath, $html);

        $html = str_replace("{previousdocs}", $this->getdoclist(), $html);

        // Return
        return $html;
    }

    function getdoclist() {
        $text = "";
        $i = 0;

        $documents = $this->db->user_documents($_SESSION['auth_username']);

        while ($i < count($documents)) {
            $text .= '<tr style="padding: 9px">';
            $text .= '<td id="File1" style="padding: 5px">'.$documents[$i]["name"].'</td>';
            $text .= '<td style="padding: 5px"> <a href="#" title="'.$documents[$i]["id"].'" class="BeaconEditDocumentButton">Edit</a> </td>';
            $text .= '<td style="padding: 5px"> <a href="#" title="'.$documents[$i]["id"].'" class="BeaconDeleteDocumentButton">Delete</a> </td>';
            $text .= '</tr>';

            $i++;
        }

        return $text;
    }

    function newdoc() {
        // Check which plugin it is
        $plugin = $this->request->payload->plugin;
        $filename = $this->request->payload->filename;

        // Get the plugin Object
        $plugin_object = include($this->pluginpath . $plugin . "/php/" . $plugin . ".php");

        // Construct the object to be sent to the plugin
        $beacon->path = $this->pluginpath . $plugin . "/";
        $beacon->url = $this->settings->url . $this->settings->php->pluginpath . $plugin . "/";
        $beacon->parser = new BeaconXSLTransformer();

        // Get the HTML
        $html = $plugin_object->newdoc($beacon);

        // Get the Source
        $beacon->html = $html;
        $source = $plugin_object->getsrc($beacon);

        // Ask the DB to create the new document
        $id = $this->db->create_document($filename, $html, $source, date('Y-m-d'),
                                    $_SESSION['auth_username'], $plugin);

        $url = "ajax.php?plugin=$plugin&id=$id&type=html";

        // Get the UI of the document
        $ui = $this->localizeHTML("document.html");
        $ui = str_replace("{id}", $id, $ui);
        $ui = str_replace("{src}", $url, $ui);
        $ui = str_replace("{imgpath}", $this->settings->url . $this->settings->php->imagepath, $ui);

        // Build the object
        $response['result'] = "success";
        $response['payload']['ui'] = $ui;
        $response['payload']['id'] = $id;

        // Send JSON of the object
        return json_encode($response);
    }

    function editdoc() {
        // Check which plugin it is
        $id = $this->request->payload->id;

        // Ask the DB to create the new document
        $obj = $this->db->fetch_document($id);

        $url = "ajax.php?plugin=".$obj['plugin']."&id=$id&type=html";

        // Get the UI of the document
        $ui = $this->localizeHTML("document.html");
        $ui = str_replace("{id}", $id, $ui);
        $ui = str_replace("{src}", $url, $ui);
        $ui = str_replace("{imgpath}", $this->settings->url . $this->settings->php->imagepath, $ui);

        // Build the object
        $response['result'] = "success";
        $response['payload']['ui'] = $ui;
        $response['payload']['id'] = $id;
        $response['payload']['plugin'] = $obj['plugin'];

        // Send JSON of the object
        return json_encode($response);
    }

    function view() {
        switch ($_GET['type']) {
            case "html":
                $plugin = $_GET['plugin'];
                $id = $_GET['id'];

                $plugin_object = include($this->pluginpath . $plugin . "/php/" . $plugin . ".php");

                $obj = $this->db->fetch_document($id);

                $html = $obj['html'];

                // Get the CSS Path
                $css_path = $plugin_object->get_css_path();

                if (!isset($_GET['nocss'])) {
                    // Apply the CSS path and wrap HTML in <body> tags
                    if ($css_path) {
                        $css_path = $this->settings->url . $this->settings->php->pluginpath . $plugin . "/" . $css_path;
                        $html = '<style type="text/css">@import "{css}";</style><body>'.$html;
                        $html = str_replace('{css}', $css_path, $html);
                        $html = $html."</body>";
                    }
                }

                return $html;

            case "source":
                $id = $_GET['id'];

                $obj = $this->db->fetch_document($id);

                $source = $obj['source'];

                return $source;

            case "revision":
                $id = $_GET['id'];
                $plugin = $_GET['plugin'];

                $plugin_object = include($this->pluginpath . $plugin . "/php/" . $plugin . ".php");

                $obj = $this->db->fetch_revision($id);

                $html = $obj['html'];

                // Get the CSS Path
                $css_path = $plugin_object->get_css_path();

                if (!isset($_GET['nocss'])) {
                    // Apply the CSS path and wrap HTML in <body> tags
                    if ($css_path) {
                        $css_path = $this->settings->url . $this->settings->php->pluginpath . $plugin . "/" . $css_path;
                        $html = '<style type="text/css">@import "{css}";</style><body>'.$html;
                        $html = str_replace('{css}', $css_path, $html);
                        $html = $html."</body>";
                    }
                }

                return $html;
        }

    }

    function savedoc() {
        $plugin = $this->request->payload->plugin;
        $id = $this->request->payload->id;
        $html = urldecode($this->request->payload->html);

        // Build the plugin object
        $plugin_object = include($this->pluginpath . $plugin . "/php/" . $plugin . ".php");

        // Construct the object to be sent to the plugin
        $beacon->path = $this->pluginpath . $plugin . "/";
        $beacon->url = $this->settings->url . $this->settings->php->pluginpath . $plugin . "/";
        $beacon->parser = new BeaconXSLTransformer();
        $beacon->html = $html;

        // Get the HTML
        $source = $plugin_object->getsrc($beacon);

        if ($source) {
            $result = $this->db->save_document($id, $html, $source, date('Y-m-d h:i:s'));
            return "DONE";
        } else {
            return "FAIL";
        }
    }

    function getsrc() {
        $id = $this->request->payload->id;
        $plugin = $this->request->payload->plugin;
        $html = urldecode($this->request->payload->html);

        $plugin_object = include($this->pluginpath . $plugin . "/php/" . $plugin . ".php");

        $beacon->path = $this->pluginpath . $plugin . "/";
        $beacon->parser = new BeaconXSLTransformer();
        $beacon->html = $html;

        $text = $plugin_object->getsrc($beacon);

        if (!$text) {
            return "FAIL";
        }

        return $text;
    }

    function gethtml() {
        $id = $this->request->payload->id;
        $plugin = $this->request->payload->plugin;
        $src = urldecode($this->request->payload->src);

        $plugin_object = include($this->pluginpath . $plugin . "/php/" . $plugin . ".php");

        $beacon->path = $this->pluginpath . $plugin . "/";
        $beacon->parser = new BeaconXSLTransformer();
        $beacon->src = $src;

        $text = $plugin_object->gethtml($beacon);

        if (!$text) {
            return "FAIL";
        }

        return $text;
    }

    function getrevisions() {
        $id = $this->request->payload->id;

        $text = $this->db->fetch_revisions($id);

        $result['revisions'] = $text;

        return json_encode($result);
    }

    function fetchdoc() {

    }

    function deletedoc() {
        $id = $this->request->payload->id;
        $obj = $this->db->fetch_document($id);

        $this->db->delete_document($id);

        $return['plugin'] = $obj['plugin'];
        $return['id'] = $obj['id'];

        return json_encode($return);
    }

    function read_settings($confFile) {
        $this->settings = json_decode(file_get_contents($confFile));
        $this->phppath = $this->fullPath . $this->settings->php->path;
        $this->i18npath = $this->phppath .  "i18n/";
        $this->pluginpath = $this->fullPath . $this->settings->php->pluginpath;
        $this->htmlpath = $this->fullPath . $this->settings->php->htmlpath;
    }

    function localizeHTML($file) {
        $text = $this->getTemplate($file);

        $array = $this->pages[$file];
        $array_keys = array_keys($array);

        $i = 0;

        for ($i = 0; $i < count($array_keys); $i++) {
            $text = str_replace("{" . $array_keys[$i] . "}", $array[ $array_keys[$i] ], $text);
        }

        return $text;
    }

    function tr($str) {
        if ($this->pages["miscellaneous"][$str]) {
            return $this->pages["miscellaneous"][$str];
        } else {
            return "No Localized String Found";
        }
    }

    function getTemplate($file) {
        return file_get_contents($this->htmlpath . $file);
    }

    function random_str($length){
        $randstr = "";
        for($i=0; $i<$length; $i++) {
            $randnum = mt_rand(0,61);
            if($randnum < 10) {
                $randstr .= chr($randnum+48);
            } else if($randnum < 36) {
                $randstr .= chr($randnum+55);
            } else {
                $randstr .= chr($randnum+61);
            }
        }
        return $randstr;
    }
};

?>
