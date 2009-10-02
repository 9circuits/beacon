##########################################################
## Beacon Hacks                                         ##
## Things in this file really need to be fixed properly ## 
##########################################################
import re
from django.conf import settings
from django.contrib.auth import REDIRECT_FIELD_NAME
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render_to_response 
from django.contrib.sites.models import Site, RequestSite
from django.http import HttpResponseRedirect 
from django.template import RequestContext
from django.views.decorators.cache import never_cache

def login(request, template_name='registration/login.html', extra_context={}, redirect_field_name=REDIRECT_FIELD_NAME):
    """
        Hacked Version of django.contrib.auth.views.login 
        This hack is needed because django login view doesn't take
        extra_context for template rendering

        Compliments of Cheater McCheaterson
    """
    redirect_to = request.REQUEST.get(redirect_field_name, '')
    if request.method == "POST":
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            # Light security check -- make sure redirect_to isn't garbage.
            if not redirect_to or '//' in redirect_to or ' ' in redirect_to:
                redirect_to = settings.LOGIN_REDIRECT_URL
            from django.contrib.auth import login
            login(request, form.get_user())
            if request.session.test_cookie_worked():
                request.session.delete_test_cookie()
            return HttpResponseRedirect(redirect_to)
    else:
        form = AuthenticationForm(request)
    request.session.set_test_cookie()
    if Site._meta.installed:
        current_site = Site.objects.get_current()
    else:
        current_site = RequestSite(request)
    extra_context.update({
        'form': form,
        redirect_field_name: redirect_to,
        'site': current_site,
        'site_name': current_site.name,
    })
    return render_to_response(template_name, extra_context, context_instance=RequestContext(request))
login = never_cache(login)

def escape_json(json_string):
    """ 
        This is a NASTY HACK that should really be taken care of on Beacon JS
        side:

        simplejson can't parse things like {"html":"this has <div id="quotes"> in it</div>"}
        because it's technically not valid JSON:

        [~]|3> simplejson.loads('{"html":"this has <div id="quotes"> in it</div>"} ')
        ....
        ValueError: Expecting , delimiter: line 1 column 27 (char 27)

        This method goes through Beacon's ajax requests looking for
        "html" and "src" identifiers  and properly escapes their content 
        so that it can later be parsed with simplejson

        Compliments of Cheater McCheaterson ;)
    """

    identifiers = ['"html":"','"src":"']
    for ident in identifiers:
        loc = json_string.rfind(ident)
        if loc != -1:
            content = json_string[loc+len(ident):-3]
            escapedcontent = content.replace('"','\\"').replace("\n","\\n")
            json_string = json_string.replace(content, escapedcontent)
    return json_string

def clean_src(src):
    """ 
        NASTY HACK needed for guidexml. docbook doesn't SEEM 
        to need it (doesn't hurt) but that's only testing on 
        new-template.xml

        Compliments of Cheater McCheaterson ;)
    """
    src = src.replace("<br>", "<br />").replace("<hr>", "<hr />")
    src = re.sub(r'<style.*>.*</style>', '', src)
    return src

