import os
import simplejson
from datetime import date

from Ft.Lib.Uri import OsPathToUri
from Ft.Xml.Xslt import Processor
from Ft.Xml import InputSource

from django.views.generic.simple import direct_to_template
from django.core.urlresolvers import reverse
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from django.template.loader import render_to_string
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError
from django.template import RequestContext
from django.conf import settings

from beacon.editor.models import Document, Section
from beacon.logger import log

@login_required
def handler(request):
    if request.POST:
        json = request.POST.keys()[0]
        log.debug("received json request: " + json)
        json_dict = simplejson.loads(json)
        try:
            action = json_dict['action']
        except Exception,e:
            log.error(e)
            return HttpResponse("error parsing action from request")
        log.debug('action = ' + action)
        if action == "beaconui":
            return beaconui(request)
        elif action == "newdoc":
            return newdoc(request)
        elif action == "savedoc":
            return savedoc(request)
        elif action == "getsrc":
            return getsrc(request)
        elif action == "gethtml":
            return gethtml(request)
        elif action == "getrevisions":
            return getrevisions(request)
        elif action == "getdoclist":
            return getdoclist(request)
        elif action == "editdoc":
            return editdoc(request)
        elif action == "deletedoc":
            return deletedoc(request)
        return HttpResponse(action)
    else:
        return view_document(request)

@login_required
def view_document(request):
    log.debug("request.GET = %s" % request.GET)
    type=request.GET.get('type')
    plugin=request.GET.get('plugin')
    docid=request.GET.get('id')
    nocss=request.GET.get('nocss')

    if plugin is None:
        return HttpResponse('plugin is NONE!')

    #log.debug("viewing doc: type=%(type)s id=%(id)s nocss=%(nocss)s" % request.GET)
    # below will ALL change to a db query to fetch the doc and grab the xml/html
    # for now it's a good test of xsl/xml -> html conversion 
    stylesheet = os.path.join(settings.XSLT_DIR,'%s2html.xsl' % plugin)
    xmltemplate = os.path.join(settings.XML_DIR,'new-%s-template.xml' % plugin)
    log.debug('stylesheet = %s' % stylesheet)
    log.debug('xmltemplate = %s' % xmltemplate)

    styuri = OsPathToUri(stylesheet)
    srcuri = OsPathToUri(xmltemplate)

    sty = InputSource.DefaultFactory.fromUri(styuri)
    src = InputSource.DefaultFactory.fromUri(srcuri)

    proc = Processor.Processor()
    proc.appendStylesheet(sty)

    document = proc.run(src)

    return render_to_response('editor/view-document-html.html',
    {'document': document, 'plugin': plugin, 'MEDIA_URL': settings.MEDIA_URL})

@login_required
def beaconui(request):
    #{"action":"beaconui"}
    return direct_to_template(request, template="editor/beaconui.html")

@login_required
def newdoc(request):
    #{"action":"newdoc","payload":{"id":"tester1820","plugin":"guidexml"}}
    json = request.POST.keys()[0]
    json_dict = simplejson.loads(json)
    payload = json_dict['payload']
    plugin = payload['plugin']
    filename = payload['filename']
    #stylesheet = settings.XSLT_DIR + '%s2html.xsl' % plugin
    #xmltemplate = settings.XML_DIR + 'new-%s-template.xml' % plugin

    #styuri = OsPathToUri(stylesheet)
    #srcuri = OsPathToUri(xmltemplate)

    #sty = InputSource.DefaultFactory.fromUri(styuri)
    #src = InputSource.DefaultFactory.fromUri(srcuri)

    #proc = Processor.Processor()
    #proc.appendStylesheet(sty)
    #output = proc.run(src)

    # create doc here instead of below non-sense
    docid = 2

    html = render_to_string('editor/document.html', {'id':docid,
    'src':'handler?plugin=%s&id=%s&type=html' % (plugin, docid), 'MEDIA_URL':settings.MEDIA_URL})

    response = {}
    response['result'] = 'success'
    response['payload'] = {'ui':html, 'id':docid}

    json = simplejson.dumps(response)

    return HttpResponse(json)


@login_required
def savedoc(request):
    return HttpResponse("savedoc")

@login_required
def getsrc(request):
    #{"action":"getsrc","payload":{"id":"tester1820","plugin":"guidexml","html":""}}
    return HttpResponse("getsrc")

@login_required
def gethtml(request):
    #{"action":"gethtml","payload":{"id":"tester8495","plugin":"guidexml","src":"xml code" }
    return HttpResponse("gethtml")

@login_required
def getrevisions(request):
    return HttpResponse("getrevisions")

@login_required
def getdoclist(request):
    #{"action":"getdoclist"}
    return HttpResponse("getdoclist")

@login_required
def editdoc(request):
    return HttpResponse("editdoc")

@login_required
def deletedoc(request):
    #{"action":"deletedoc","payload":{"id":"tester1820","plugin":"guidexml"}}
    return HttpResponse("deletedoc")

@login_required
def index(request):
	return direct_to_template(request, template="editor/index.html")

##################################
# BELOW IS CODE FOR OLDER BEACON #
##################################

@login_required
def form(request, template):
	return direct_to_template(request, template=template)


@login_required
def dialog(request, template):
	return direct_to_template(request, template=template)


@login_required
def ajax_new(request):
	user = request.user
	logged_in = user.is_authenticated()
	if not logged_in:
		user = None

	title = request.POST['title']
	abstract = request.POST['abstract']
	author = request.POST['author']
	d = date(*[int(s) for s in request.POST['date'].split("-")])

	if request.method == "POST":
		doc = Document.objects.create_new_document(logged_in=logged_in, user=user, title=title, abstract=abstract, author=author, date=d)

		return HttpResponseRedirect(reverse('editor', args=(doc.doc_key,)))

	else:
		return HttpResponseServerError("<h1>Incorrect Method</h1><br /><p>This view can only be used with the POST method.</p>")


@login_required
def ajax_edit(request):
	user = request.user
	logged_in = user.is_authenticated()
	if not logged_in:
		user = None
	
	if request.method == "POST":
		file = request.FILES['xmlf']
		docstruct = Document.objects.parse_document(file.read())

		# <Debuggin' Code>
		#ds = docstruct.copy()

		#chapters = ds['chapters']
		#del ds['chapters']
		#for c in chapters:
		#	sections = c['sections']
		#	del c['sections']
		#	for s in sections:
		#		print s

		#for k in ds:
		#	print k[0]+": "+k[1]
		
		# </Debuggin' Code>

		doc = Document.objects.create_document(docstruct)

		return HttpResponseRedirect(reverse('editor', args=(doc.doc_key,)))
	
	else:
		return HttpResponseServerError("<h1>Incorrect Method</h1><br /><p>This view can only be used with the POST method.</p>")


@login_required
def ajax_document_html(request, document_key):
	doc = Document.objects.get(doc_key=document_key)

	return HttpResponse(doc.to_html(request))


@login_required
def ajax_document_xml(request, document_key):
	doc = Document.objects.get(doc_key=document_key)

	return HttpResponse(doc.to_xml(request))


@login_required
def editor(request, document_key):
	doc = Document.objects.get(doc_key=document_key)

	return render_to_response("editor/editor.html", {'doc_key': doc.doc_key}, context_instance=RequestContext(request))


@login_required
def save(request, document_key):
	return render_to_response("editor/dialogs/savedocument.html", {'doc_key':document_key})


@login_required
def ajax_section_html(request, document_key, section_id):
	pass


@login_required
def ajax_view_source(request, document_key):
	return render_to_response("editor/dialogs/sourceview.html", {"doc_key":document_key})


@login_required
def ajax_save(request):
	doc_key = request.POST['doc_key']
	text = request.POST['text']

	Document.objects.create_document(Document.objects.parse_html_document(str(text)), doc_key=doc_key)

	return HttpResponse("");


@login_required
def ajax_update(request):
	pass


@login_required
def ajax_collab(request):
	pass


