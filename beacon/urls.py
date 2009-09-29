from django.conf.urls.defaults import *
from django.conf import settings
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('',
		(r'^$', 'beacon.editor.views.index', {}, 'index'),

        (r'^handler$', 'beacon.editor.views.handler', {}, 'handler'),
		#(r'^ajax/new/$', 'beacon.editor.views.ajax_new', {}, 'ajax-new'),
		#(r'^ajax/edit/$', 'beacon.editor.views.ajax_edit', {}, 'ajax-edit'),
		#(r'^ajax/new_form/$', 'beacon.editor.views.form', {'template':'editor/new-form.html'}, 'ajax-new-form'),
		#(r'^ajax/edit_form/$', 'beacon.editor.views.form', {'template':'editor/edit-form.html'}, 'ajax-edit-form'),
		#(r'^ajax/collab_form/$', 'beacon.editor.views.form', {'template':'editor/collab-form.html'}, 'ajax-collab-form'),

		#(r'^editor/(?P<document_key>[a-zA-Z0-9_-]+)/$', 'beacon.editor.views.editor', {}, 'editor'),

		#(r'^ajax/html/(?P<document_key>[a-zA-Z0-9_-]+)/$', 'beacon.editor.views.ajax_document_html', {}, 'ajax-document-html'),
		#(r'^ajax/html/(?P<document_key>[a-zA-Z0-9_-]+)/(?P<section_id>\d+)/$', 'beacon.editor.views.ajax_section_html', {}, 'ajax-section-html'),
		#(r'^ajax/xml/(?P<document_key>[a-zA-Z0-9_-]+)/$', 'beacon.editor.views.ajax_document_xml', {}, 'ajax_document_xml'),
		#(r'^save/(?P<document_key>[a-zA-Z0-9_-]+)/$', 'beacon.editor.views.save', {}, 'save'),
		#(r'^ajax/save/$', 'beacon.editor.views.ajax_save', {}, 'ajax-save'),
		#(r'^ajax/view_source/(?P<document_key>[a-zA-Z0-9_-]+)/$', 'beacon.editor.views.ajax_view_source', {}, 'ajax-view-source'),
		#(r'^ajax/update/(?P<document_key>[a-zA-Z0-9_-]+)/$', 'beacon.editor.views.ajax_update', {}, 'ajax-update'),
		#(r'^ajax/collab/(?P<document_key>[a-zA-Z0-9_-]+)/$', 'beacon.editor.views.ajax_collab', {}, 'ajax-collab'),
		
		#(r'^ajax/addsection/$', 'beacon.editor.views.dialog', {'template': 'editor/dialogs/addsection.html'}, 'add-section'),
		#(r'^ajax/addchapter/$', 'beacon.editor.views.dialog', {'template': 'editor/dialogs/addchapter.html'}, 'add-chapter'),
		#(r'^ajax/addauthor/$', 'beacon.editor.views.dialog', {'template': 'editor/dialogs/addauthor.html'}, 'add-author'),
		#(r'^ajax/addlink/$', 'beacon.editor.views.dialog', {'template': 'editor/dialogs/addlink.html'}, 'add-link'),

		(r'^login/', 'django.contrib.auth.views.login', {'template_name':'login.html'}, 'login'),
		(r'^logout/', 'django.contrib.auth.views.logout_then_login', {}, 'logout'),

		(r'^admin/(.*)', admin.site.root),
        (r'^admin/doc/', include('django.contrib.admindocs.urls')),
)

# Static Media.  FOR TESTING PURPOSES ONLY.
if settings.DEBUG:
	urlpatterns += patterns('', (r'^media_files/(?P<path>.*)$', 'django.views.static.serve', {'document_root' : settings.MEDIA_ROOT, 'show_indexes' : True}))
