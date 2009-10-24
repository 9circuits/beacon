# django-beacon example django.wsgi file 
# 
# This config also assumes you have a user called 'user' with latest django branch checked out to /home/user/beacon
# e.g:
#
# user@localhost $ ls /home/user/beacon
# apache beacon ebuild README.txt
#
import os
import sys

# path to parent folder containing beacon folder
sys.path.append('/home/user/beacon')

# path to beacon folder (ie one with manage.py, settings.py, etc in it)
sys.path.append('/home/user/beacon/beacon')

os.environ['DJANGO_SETTINGS_MODULE'] = 'beacon.settings_production'

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()

