from django.shortcuts import render_to_response
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError
from django.conf import settings


def ajax_new(request):
	logged_in = request.user.is_authenticated()

	if logged_in:
		user = request.user
	else:
		user = None

	if request.method == "POST":
		doc = Document.objects.create_new_document(logged_in=logged_in, user=user, **request.POST)

		return render_to_response()

	else:
		return HttpResponseServerError("<h1>Incorrect Method</h1><br /><p>This view can only be used with the POST method.</p>")


def ajax_document_html(request, document_id):
	pass

def ajax_section_html(request, document_id, section_id):
	pass
