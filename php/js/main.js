$(document).ready(function() {
    $(window).bind("keydown", KeyDown);
});

// Enter key Bug
function KeyDown(e) {
    if (!e) e = window.event;

    switch(e.keyCode) {
        case 13:
            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();
        break;
    }
}

$(function() {

    var name = $("#name"),
    email = $("#email"),
    password = $("#password"),
    name1 = $("#name1"),
    password1= $("#password1"),
    name2 = $("#name2"),
    email2 = $("#email2"),
    password2= $("#password2"),
    allFields = $([]).add(name).add(email).add(password),
    allFields1 = $([]).add(name1).add(password1),
    allFields2 = $([]).add(name2).add(email2).add(password2),
    tips1 = $("#validateTips1");
    tips2 = $("#validateTips2");
    tips3 = $("#validateTips3");

    function updateTips(t) {
        tips1.text(t).effect("highlight",{},1500);
    }

    function checkLength(o,n,min,max) {
        if ( o.val().length > max || o.val().length < min ) {
            o.addClass('ui-state-error');
            updateTips("Length of "+n+" must be between "+min+" and "+max+".");
            return false;
        } else {
            return true;
        }

    }

    function checkRegexp(o,regexp,n) {
        if ( !( regexp.test( o.val() ) ) ) {
            o.addClass('ui-state-error');
            updateTips(n);
            return false;
        } else {
            return true;
        }

    }

    $("#createUserDialog").dialog({
        autoOpen: false,
        height: 300,
        modal: true,
        buttons: {
            'Create an account': function() {
                var bValid = true;
                allFields.removeClass('ui-state-error');

                bValid = bValid && checkLength(name,"username",3,16);
                bValid = bValid && checkLength(email,"email",6,80);
                bValid = bValid && checkRegexp(name,/^[a-z]([0-9a-z_])+$/i,"Username may consist of a-z, 0-9, underscores, begin with a letter.");
                bValid = bValid && checkRegexp(email,/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,"eg. ui@jquery.com");
            },
            Cancel: function() {
                $(this).dialog('close');
            }
        },
        close: function() {
            allFields.val('').removeClass('ui-state-error');
        }
    });


    function updateTips1(t) {
        tips2.text(t).effect("highlight",{},1500);
    }

    function checkLength1(o,n,min,max) {
        if ( o.val().length > max || o.val().length < min ) {
            o.addClass('ui-state-error');
            updateTips1("Length of "+n+" must be between "+min+" and "+max+".");
            return false;
        } else {
            return true;
        }

    }

    function checkRegexp1(o,regexp,n) {
        if ( !( regexp.test( o.val() ) ) ) {
            o.addClass('ui-state-error');
            updateTips1(n);
            return false;
        } else {
            return true;
        }

    }

    $("#loginDialog").dialog({
        autoOpen: false,
        height: 300,
        modal: true,
        buttons: {
            Login: function() {
                var bValid = true;
                allFields1.removeClass('ui-state-error');

                bValid = bValid && checkLength1(name1,"username",3,16);
                bValid = bValid && checkRegexp1(name1,/^[a-z]([0-9a-z_])+$/i,"Username may consist of a-z, 0-9, underscores, begin with a letter.");
                if (bValid) {
                    $("#loginForm").submit();
                }
            },
            Cancel: function() {
                $(this).dialog('close');
            }
        },
        close: function() {
            allFields1.val('').removeClass('ui-state-error');
        }
    });


    function updateTips2(t) {
        tips3.text(t).effect("highlight",{},1500);
    }

    function checkLength2(o,n,min,max) {
        if ( o.val().length > max || o.val().length < min ) {
            o.addClass('ui-state-error');
            updateTips2("Length of "+n+" must be between "+min+" and "+max+".");
            return false;
        } else {
            return true;
        }

    }

    function checkRegexp2(o,regexp,n) {
        if ( !( regexp.test( o.val() ) ) ) {
            o.addClass('ui-state-error');
            updateTips2(n);
            return false;
        } else {
            return true;
        }

    }

    $("#installDialog").dialog({
        autoOpen: false,
        height: 300,
        modal: true,
        buttons: {
            Install: function() {
                var bValid = true;
                allFields2.removeClass('ui-state-error');

                bValid = bValid && checkLength2(name2,"username",3,16);
                bValid = bValid && checkLength2(email2,"email",6,80);
                bValid = bValid && checkRegexp2(name2,/^[a-z]([0-9a-z_])+$/i,"Username may consist of a-z, 0-9, underscores, begin with a letter.");
                bValid = bValid && checkRegexp2(email2,/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,"eg. ui@jquery.com");
                if (bValid) {
                    $("#installForm").submit();
                }
            },
            Cancel: function() {
                $(this).dialog('close');
            }
        },
        close: function() {
            allFields2.val('').removeClass('ui-state-error');
        }
    });

    $('#create-user').click(function() {
        $('#createUserDialog').dialog('open');
    })
    .hover(
        function(){
            $(this).addClass("ui-state-hover");
        },
        function(){
            $(this).removeClass("ui-state-hover");
        }
    ).mousedown(function(){
        $(this).addClass("ui-state-active");
    })
    .mouseup(function(){
        $(this).removeClass("ui-state-active");
    });



    $('#login').click(function() {
        $('#loginDialog').dialog('open');
    }).hover(
        function(){
            $(this).addClass("ui-state-hover");
        },
        function(){
            $(this).removeClass("ui-state-hover");
        }
    ).mousedown(function(){
        $(this).addClass("ui-state-active");
    })
    .mouseup(function(){
        $(this).removeClass("ui-state-active");
    });



    $('#install').click(function() {
        $('#installDialog').dialog('open');
    })
    .hover(
        function(){
            $(this).addClass("ui-state-hover");
        },
        function(){
            $(this).removeClass("ui-state-hover");
        }
    ).mousedown(function(){
        $(this).addClass("ui-state-active");
    })
    .mouseup(function(){
        $(this).removeClass("ui-state-active");
    });

});