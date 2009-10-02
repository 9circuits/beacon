from django.conf.urls.defaults import *
from django.conf import settings
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('',
		(r'^$', 'beacon.editor.views.index', {}, 'index'),
		(r'^login/', 'beacon.editor.views.login', {'template_name':'login.html'}, 'login'),
		(r'^logout/', 'django.contrib.auth.views.logout_then_login', {}, 'logout'),
        (r'^handler$', 'beacon.editor.views.handler', {}, 'handler'),

		(r'^admin/(.*)', admin.site.root),
        (r'^admin/doc/', include('django.contrib.admindocs.urls')),
)

# Static Media.  FOR TESTING PURPOSES ONLY.
if settings.DEBUG:
	urlpatterns += patterns('', (r'^media_files/(?P<path>.*)$', 'django.views.static.serve', {'document_root' : settings.MEDIA_ROOT, 'show_indexes' : True}))
