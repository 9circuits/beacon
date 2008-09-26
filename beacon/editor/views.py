from django.shortcuts import render_to_response
from beacon.editor.models import Document
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError
from django.conf import settings


def ajax_new(request):
	logged_in = request.user.is_authenticated()

	if logged_in:
		user = request.user
	else:
		user = None

	title = request.POST['title']
	abstract = request.POST['abstract']
	author = request.POST['author']
	date = request.POST['date']

	if request.method == "POST":
		doc = Document.objects.create_new_document(logged_in=logged_in, user=user, title=title, abstract=abstract, author=author, date=date)

		return render_to_response("editor/editor.html", {})

	else:
		return HttpResponseServerError("<h1>Incorrect Method</h1><br /><p>This view can only be used with the POST method.</p>")


def ajax_document_html(request, document_id):
	pass

def ajax_section_html(request, document_id, section_id):
	pass
