from django.views.generic.simple import direct_to_template
from django.core.urlresolvers import reverse
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from beacon.editor.models import Document, Section
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError
from django.template import RequestContext
from django.conf import settings
from datetime import date
import simplejson
from beacon.logger import log

@login_required
def handler(request):
    if request.POST:
        json = request.POST.keys()[0]
        log.debug("received json request: " + json)
        try:
            action = simplejson.loads(json)['action']
        except Exception,e:
            log.error(e)
            return HttpResponse("error parsing action from request")
        log.debug('action = ' + action)
        if action == "beaconui":
            return beaconui(request)
        return HttpResponse(action)
    else:
        return HttpResponse('You wanna GET me eh?')

@login_required
def beaconui(request):
    return direct_to_template(request, template="editor/beaconui.html")

@login_required
def index(request):
	return direct_to_template(request, template="editor/index.html")

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


