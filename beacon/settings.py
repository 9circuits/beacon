# Django settings for Beacon GuideXML project

# New way of doing base directories.
# Create a file called "base_directory.py" in your project directory 
# (the same directory in which settings.py resides) with one line of code 
#   which sets the BASE_DIRECTORY variable.
#       BASE_DIRECTORY = "/home/someuser/beacon/django_port/beacon/"
# Also add base_directory.py to your .gitignore.

try:
    from base_directory import BASE_DIRECTORY
except:
    import os
    import sys
    # path to installation
    BASE_DIRECTORY = sys.path[0] + os.path.sep 

DEBUG = False
DEBUG = True
TEMPLATE_DEBUG = DEBUG

ADMINS = (
)

MANAGERS = ADMINS

DATABASE_ENGINE = 'sqlite3'
DATABASE_NAME = './beacon.db'
DATABASE_USER = ''
DATABASE_PASSWORD = ''
DATABASE_HOST = ''
DATABASE_PORT = ''

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'America/Chicago'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# Absolute path to the directory that holds media.
# Example: "/home/media/media.lawrence.com/"
MEDIA_ROOT = BASE_DIRECTORY+'media/'

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash if there is a path component (optional in other cases).
# Examples: "http://media.lawrence.com", "http://example.com/media/"
MEDIA_URL = '/media_files/'

# URL prefix for admin media -- CSS, JavaScript and images. Make sure to use a
# trailing slash.
# Examples: "http://foo.com/media/", "/media/".
ADMIN_MEDIA_PREFIX = '/media/'

# Make this unique, and don't share it with anybody.
SECRET_KEY = 'he+sj4i!@g1b-y93x@#q=pfnm8p-@34*652zv_)hk5tl40^qs_'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
	'django.template.loaders.filesystem.load_template_source',
	'django.template.loaders.app_directories.load_template_source',
#	'django.template.loaders.eggs.load_template_source',
)

MIDDLEWARE_CLASSES = (
	'django.middleware.common.CommonMiddleware',
	'django.contrib.sessions.middleware.SessionMiddleware',
	'django.contrib.auth.middleware.AuthenticationMiddleware',
)

TEMPLATE_CONTEXT_PROCESSORS = (
	"django.core.context_processors.auth",
	#"django.core.context_processors.debug",
	"django.core.context_processors.i18n",
	"django.core.context_processors.media",

	"beacon.context_processors.dojo_cp",
	"beacon.context_processors.beacon_cp",
)

ROOT_URLCONF = 'beacon.urls'

TEMPLATE_DIRS = (
	BASE_DIRECTORY + "templates/",
)

INSTALLED_APPS = (
	'django.contrib.auth',
	'django.contrib.contenttypes',
	'django.contrib.sessions',
	'django.contrib.sites',
	'django.contrib.admin',

	'beacon.editor',
)

XSLT_DIR = BASE_DIRECTORY + "xsl/"

DOJO_LOCAL = False

BEACON_VERSION = "1.0"

LOGIN_URL = "/login/"
LOGIN_REDIRECT_URL = "/"
LOGOUT_URL = "/logout/"
