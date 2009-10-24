import os
import sys

# path to parent folder containing beacon
sys.path.append('/home/user/repos')

# path to beacon folder
sys.path.append('/home/user/repos/beacon')

os.environ['DJANGO_SETTINGS_MODULE'] = 'beacon.settings'

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()

