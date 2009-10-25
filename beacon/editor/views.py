import os
import re
import simplejson

from django.views.generic.simple import direct_to_template
from django.template.loader import render_to_string
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse

from beacon.editor.models import Document, Revision
from beacon.logger import log
from beacon.editor.hacks import login as _login
from beacon.editor.hacks import escape_json

class Registry(dict):
    """Plain old python dict with a function called register for adding
    key/value pairs"""
    def register(self, key, value):
        self.__setitem__(key, value)

# dict of beacon POST (ajax) views 
post_registry = Registry()
# dict of beacon GET views
get_registry = Registry()

@login_required
def handler(request):
    """
       Main POST/GET Handler for Beacon
       POSTs in Beacon are JSON requests
       GETs in Beacon return html/xml/json
    """
    if request.POST:
        json_dict = get_json(request)
        log.debug("received json response: %s" % json_dict.keys())
        try:
            action = json_dict['action']
        except KeyError,e:
            log.error(e)
            return HttpResponse("error retrieving action from POST request")
        log.debug('action = ' + action)
        try:
            ajax_method = post_registry[action]
            return ajax_method(request)
        except Exception, e:
            log.error(e)
            return HttpResponse(action)
    else:
        try:
            type=request.GET['type']
        except Exception, e:
            log.error(e)
            return HttpResponse("error parsing type from GET request")
        log.debug("type = " + type)
        try:
            get_method = get_registry[type]
            return get_method(request)
        except Exception, e:
            log.error(e)
            return HttpResponse(type)
        return HttpResponse(type)

def get_json(request, debug=False):
    try:
        json = request.POST.keys()[0]
        if debug:
            jsonfile = os.path.join(tempfile.gettempdir(), 'json-data.txt')
            log.debug('writing json response to file: %s' % jsonfile)
            open(jsonfile, 'w').write(json)
        # nasty hack to clean html and src json fields
        json = escape_json(json)
        #log.debug('json = %s' % json)
        json_dict = simplejson.loads(json)
    except Exception,e:
        log.error('Error: %s' % e)
        json_dict = {}
    return json_dict

def get_payload(request):
    """Get payload data from ajax request"""
    json_dict = get_json(request)
    payload = json_dict['payload']
    return payload

@login_required
def view_document(request):
    #/handler?type=html&plugin=guidexml&id=23
    log.debug("request.GET = %s" % request.GET)
    plugin=request.GET.get('plugin')
    docid=request.GET.get('id')
    nocss=request.GET.get('nocss')

    try:
        doc = Document.objects.get(id=docid, format=plugin)
        return direct_to_template(request, template='editor/view-document-html.html',
        extra_context={'document': doc.html, 'plugin': plugin, })
    except Exception,e:
        return HttpResponse('Error: %s' % e)
get_registry.register("html", view_document)

@login_required
def view_revision(request):
    #/handler?type=revision&plugin=docbook&id=51
    user = request.user 
    id = request.GET.get('id')
    try:
        rev = Revision.objects.get(id=id)
        return direct_to_template(request, template='editor/view-document-html.html',
        extra_context={'document': rev.html, 'plugin': rev.doc.format,})
    except Exception, e:
        log.error(e)
        return HttpResponse("Error: %s" % e)
get_registry.register("revision", view_revision)

@login_required
def beaconui(request):
    #{"action":"beaconui"}
    docs = Document.objects.get_docs_for_user(request.user)
    previousdocs = render_to_string('editor/doclist.html', {'docs': docs})
    return direct_to_template(request, template="editor/beaconui.html",
    extra_context={'previousdocs': previousdocs})
post_registry.register("beaconui", beaconui)

@login_required
def newdoc(request):
    #{"action":"newdoc","payload":{"plugin":"docbook","filename":"tester2"}}
    payload = get_payload(request)

    user = request.user
    name = payload['filename']
    format = payload['plugin']

    doc = Document.objects.create_new_document(user,name,format)
    
    html = doc.get_ui_html()

    response = {}
    response['result'] = 'success'
    response['payload'] = {'ui':html, 'id':doc.id}

    json = simplejson.dumps(response)

    return HttpResponse(json, mimetype="application/json")
post_registry.register("newdoc", newdoc)

@login_required
def savedoc(request):
    user = request.user
    payload = get_payload(request)
    id = payload['id']
    format = payload['plugin']
    html = payload['html']
    src = Document.objects.html_to_xml(html,format)
    try:
        doc = Document.objects.get(id=id, format=format, user=user)
        doc.html = html
        doc.source = src
        doc.save()
        return HttpResponse("DONE")
    except Exception,e:
        log.error("Error: %s" % e)
        return HttpResponse("FAIL")
post_registry.register("savedoc", savedoc)

@login_required
def getsrc(request):
    #{"action":"getsrc","payload":{"id":"tester1820","plugin":"guidexml","html":""}}
    payload = get_payload(request)
    id = payload['id']
    format = payload['plugin']
    html = payload['html']
    src = Document.objects.html_to_xml(html,format)
    return HttpResponse(src)
post_registry.register("getsrc", getsrc)

@login_required
def gethtml(request):
    #{"action":"gethtml","payload":{"id":"tester8495","plugin":"guidexml","src":"xml code" }
    payload = get_payload(request)
    id = payload['id']
    format = payload['plugin']
    xml = payload['src']
    src = Document.objects.xml_to_html(xml,format)
    return HttpResponse(src)
post_registry.register("gethtml", gethtml)

@login_required
def getrevisions(request):
    # json request: {"action":"getrevisions","payload":{"id":"14"}}
    # json response: {"revisions":[{"id":"77","docid":"16","time":"2009-10-01 10:31:17","num":"0"}]}
    user = request.user
    payload = get_payload(request)
    id = payload['id']
    try:
        doc = Document.objects.get(id=id, user=user)
        revs_json = doc.get_revisions_json()
        return HttpResponse(revs_json)
    except Exception,e:
        return HttpResponse('Error: %s' % e)
post_registry.register("getrevisions", getrevisions)

@login_required
def getdoclist(request):
    #{"action":"getdoclist"}
    docs = Document.objects.get_docs_for_user(request.user)
    log.info('user %s has %s docs' % (request.user, docs.count()))
    return direct_to_template(request,template='editor/doclist.html',
    extra_context={'docs': docs})
post_registry.register("getdoclist", getdoclist)

@login_required
def editdoc(request):
    #{"action":"editdoc","payload":{"id":"1"}}
    user = request.user
    payload = get_payload(request)
    id = payload['id']
    try:
        doc = Document.objects.get(id=id, user=user)
        html = doc.get_ui_html()
        response = {}
        response['result'] = 'success'
        response['payload'] = {'ui':html, 'id':doc.id, 'plugin': doc.format}
        json = simplejson.dumps(response)
        return HttpResponse(json, mimetype="application/json")
    except Exception,e:
        log.error('Error: %s' % e)
        return HttpResponse('Error: %s' % e)
post_registry.register("editdoc", editdoc)

@login_required
def deletedoc(request):
    """Deletes a document from the database by id"""
    #{"action":"deletedoc","payload":{"id":"9"}} 
    user = request.user
    payload = get_payload(request)
    id = payload['id']
    try:
        doc = Document.objects.get(id=id, user=user)
        response = {}
        response['plugin'] = doc.format
        response['id'] = doc.id
        doc.delete()
        json = simplejson.dumps(response)
        return HttpResponse(json, mimetype="application/json")
    except Exception, e:
        return HttpResponse("Error: %s" % e)
post_registry.register("deletedoc", deletedoc)

@login_required
def index(request):
	return direct_to_template(request, template="editor/index.html")

def login(request, template_name):
    http_user_agent = request.META['HTTP_USER_AGENT']
    firefox_regex = re.compile(("(Firefox)/([0-9\.]+)"))
    has_firefox = firefox_regex.search(http_user_agent)
    span_class = "ui-state-error"
    if has_firefox:
        browser = has_firefox.group(1)
        version = int(has_firefox.group(2)[0])
        if version >= 3:
            log.info("User %s is using Firefox 3.0+ (%s)" %
            (request.user, http_user_agent))
            browser_msg = """Browser is Firefox 3.0+. OK."""
            span_class = "ui-state-default"
        else:
            log.info("User %s using Firefox < 3.0 (%s)" %
            (request.user, http_user_agent))
            browser_msg = """Error: This version of firefox may not
            work well with Beacon.  Use 3.0+ only."""
    else:
        log.info("User %s is not using Firefox 3.0+ (%s)" %
        (request.user, http_user_agent))
        browser_msg = """Error: This browser maybe incompatible with Beacon.
        Please use Firefox 3.0+ only."""
    return _login(request, template_name=template_name,
    extra_context={"browser_msg": browser_msg, "span_class":
    span_class})
