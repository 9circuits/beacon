Installation instructions.

Step 1 (Checking it out of the Git repository):

Start off, obviously, by checking the branch out of the Git repo.  If I've
checked it in correctly, you should get one file (README.txt) and three
directories (beacon, templates, media).


Step 2 (Setting up "mysettings"):

When developing Django apps, it's generally nice to be able to use different
settings for development purposes than you would on a production server.
However, editing the settings.py file by hand every time you're updating the
running version can be a very large pain.

Hence, the "mysettings" system.  We set an environment variable
(MYSETTINGS_DIR_BEACON, in this case) to hold the path to further
configuration files which override the settings in settings.py.
We then check for the existence of the variable in
settings.py and load the python modules to which it points so as to override
production environment settings with development box settings.

To set this up, first create a directory called "mysettings" somewhere that
won't get in the way, but somewhere where it is still associated with the
django version of beacon on your machine.  In that directory, touch
__init__.py.  Next, create two files -- mysettings.py and mypatterns.py --
with the following contents adjusted to your own system:

mysettings.py:
DEBUG=True
TEMPLATE_DEBUG=DEBUG

# The following database options are optional.  You can either set up MySQL on
# your box to mirror these options, or make your own settings.
#DATABASE_ENGINE = 'mysql'
#DATABASE_NAME = 'beacon'
#DATABASE_USER = 'beacon'
DATABASE_PASSWORD = 'pass' #This option, however, is highly recommended.
#DATABASE_HOST = ''
#DATABASE_PORT = ''

TEMPLATE_DIRS=(
	# Adjust this path as necessary to point to the templates directory.
	"/home/user/django_projects/beacon/beacon-django/templates/",
)

# Adjust this path as necessary to point to the media directory.
MEDIA_ROOT="/home/user/django_projects/beacon/beacon-django/media/"

# Feel free to add any other options you wish.
# You can find a full listing of available options at:
# http://docs.djangoproject.com/en/dev/ref/settings/#ref-settings



mypatterns.py:
# No need to adjust anything here.
from django.conf.urls.defaults import *
from django.conf import settings

mypatterns = patterns('',
# Static content.  ONLY FOR DEVELOPMENT/TESTING PURPOSES.
        (r'^media_files/(?P<path>.*)$', 'django.views.static.serve', {'document_root' : settings.MEDIA_ROOT, 'show_indexes' : True}),
)




You'll then need to set the environment variable.  I'd recommend creating a
new file in /etc/env.d/ with a couple of lines something like this:
MYSETTINGS_DIR_BEACON=/home/user/django_projects/beacon/mysettings
MYPATTERNS_DIR_BEACON=/home/user/django_projects/beacon/mysettings

(Yes, both variables need to be set and need to point to the same location.)

These variables will need to hold the path of the mysettings directory you
created, not any of the files in it.

You'll then need to run env-update as root and source /etc/profile in the
shell in which you intend to run the development server.


Step 3 (Setting up database tables):

You can now cd to the project directory (the one containing
settings.py) and type ./manage.py syncdb.  If everything's done right, it will
ask you to set up an administrative user.  Do so.


Step 4 (Running the development server):

When ./manage.py syncdb finishes successfully, you can start development
server with ./manage.py runserver.


Step 5 (Visiting the administrative interface):

Open your favorite browser and visit http://localhost:8000/admin.  Enter the
username and password you created in step 3.  This will let you browse and
edit data directly in the database.


At the moment there are no other pages to play with.  That will come later.
