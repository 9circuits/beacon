from django.conf.urls.defaults import *
from django.conf import settings
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('',
		(r'^$', 'django.views.generic.simple.direct_to_template', {'template':'editor/index.html'}, 'index'),

		(r'^ajax/new/$', 'beacon.editor.views.ajax_new', {}, 'ajax-new'),
		(r'^ajax/new_form/$', 'django.views.generic.simple.direct_to_template', {'template':'editor/new-form.html'}, 'ajax-new-form'),
		(r'^ajax/edit_form/$', 'django.views.generic.simple.direct_to_template', {'template':'editor/edit-form.html'}, 'ajax-edit-form'),
		(r'^ajax/collab_form/$', 'django.views.generic.simple.direct_to_template', {'template':'editor/collab-form.html'}, 'ajax-collab-form'),
		(r'^ajax/html/(?P<document_id>\d+)/$', 'beacon.editor.views.ajax_document_html', {}, 'ajax-document-html'),
		(r'^ajax/html/(?P<document_id>\d+)/(?P<section_id>\d+)/$', 'beacon.editor.views.ajax_section_html', {}, 'ajax-section-html'),

    (r'^admin/(.*)', admin.site.root),
    (r'^admin/doc/', include('django.contrib.admindocs.urls')),
)

try:
	from mypatterns import mypatterns
	urlpatterns += mypatterns
except:
	pass
