"""
This code was modified from django-tinymce project's TinyMCE widget 
which was copied and extended from this code by John D'Agostino:

http://code.djangoproject.com/wiki/CustomWidgetsTinyMCE
"""

from django import forms
from django.conf import settings
from django.contrib.admin import widgets as admin_widgets
from django.core.urlresolvers import reverse
from django.forms.widgets import flatatt
from django.forms.util import smart_unicode
from django.utils.html import escape
from django.utils import simplejson
from django.utils.datastructures import SortedDict
from django.utils.safestring import mark_safe
from django.utils.translation import get_language, ugettext as _
import beacon.settings


class BeaconEditor(forms.Textarea):
    """
    BeaconEditor widget. Set settings.BEACON_JS_URL to set the location of the
    javascript file. Default is "MEDIA_URL + 'js/beacon/beaccon.js'".
    You can customize the configuration with the beacon_attrs argument to the
    constructor.

    In addition to the standard configuration you can set the
    'content_language' parameter. It takes the value of the 'language'
    parameter by default.

    This widget sets the 'language', 'directionality' and 'spellchecker_languages' 
    parameters by default. The first is derived from the current Django language, 
    the others from the 'content_language' parameter.
    """

    def __init__(self, content_language=None, attrs=None, beacon_attrs={}):
        super(BeaconEditor, self).__init__(attrs)
        self.beacon_attrs = beacon_attrs
        if content_language is None:
            content_language = beacon_attrs.get('language', None)
        self.content_language = content_language
        print self.content_language

    def render(self, name, value, attrs=None):
        if value is None: value = ''
        value = smart_unicode(value)
        final_attrs = self.build_attrs(attrs)
        final_attrs['name'] = name
        assert 'id' in final_attrs, "BeaconEditor widget attributes must contain 'id'"

        beacon_config = getattr(beacon.settings,'BEACON_DEFAULT_CONFIG', {}).copy()
        beacon_config.update(self.beacon_attrs)
        beacon_config['elements'] = final_attrs['id']
        beacon_json = simplejson.dumps(beacon_config)

        html = [u'<textarea%s>%s</textarea>' % (flatatt(final_attrs), escape(value))]
        html.append(u'<script type="text/javascript">BeaconEditor.init(%s)</script>' % beacon_json)
        return mark_safe(u'\n'.join(html))

    def _media(self):
        js = [getattr(beacon.settings,"BEACON_JS_URL", '')]
        return forms.Media(js=js)

    media = property(_media)

class AdminBeaconEditor(admin_widgets.AdminTextareaWidget, BeaconEditor):
    pass

def get_language_config(content_language=None):
    language = get_language()[:2]
    if content_language:
        content_language = content_language[:2]
    else:
        content_language = language

    config = {}
    config['language'] = language

    lang_names = SortedDict()
    for lang, name in settings.LANGUAGES:
        if lang[:2] not in lang_names: lang_names[lang[:2]] = []
        lang_names[lang[:2]].append(_(name))
    sp_langs = []
    for lang, names in lang_names.items():
        if lang == content_language:
            default = '+'
        else:
            default = ''
        sp_langs.append(u'%s%s=%s' % (default, ' / '.join(names), lang))

    config['spellchecker_languages'] = ','.join(sp_langs)

    if content_language in settings.LANGUAGES_BIDI:
        config['directionality'] = 'rtl'
    else:
        config['directionality'] = 'ltr'

    if beacon.settings.USE_SPELLCHECKER:
        config['spellchecker_rpc_url'] = reverse('beacon.views.spell_check')

    return config
