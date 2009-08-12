<?php

class BeaconAuth
{
    var $db;
    var $user_id;
    var $username;
    var $password;
    var $ok;

    function BeaconAuth($db)
    {
        $this->db = $db;
        $this->user_id = 0;
        $this->username = "Guest";
        $this->ok = false;

        return $this->ok;
    }

    function check_session()
    {
        if(!empty($_SESSION['auth_username']) && !empty($_SESSION['auth_password'])) {
            return $this->check($_SESSION['auth_username'], $_SESSION['auth_password']);
        } else {
            return false;
        }
    }

    function login($username, $password)
    {
        $user = $this->db->validate_user($username, $password);

        if($user)
        {
            if($user['password'] == $password)
            {
                $this->user_id = $user['id'];
                $this->username = $username;
                $this->ok = true;

                $_SESSION['auth_username'] = $username;
                $_SESSION['auth_password'] = $password;
                session_write_close();

                return true;
            }
        }
        return false;
    }

    function check($username, $password)
    {
        $user = $this->db->validate_user($username, $password);

        if($user)
        {
            if($user['password'] == $password)
            {
                $this->user_id = $user['id'];
                $this->username = $username;
                $this->ok = true;
                return true;
            }
        }
        return false;
    }

    function logout()
    {
        $this->user_id = 0;
        $this->username = "Guest";
        $this->ok = false;

        $_SESSION['auth_username'] = "";
        $_SESSION['auth_password'] = "";
        session_write_close();
    }

}