===================================================
====                                           ====
==== Beacon GuideXML Installation Instructions ====
====                                           ====
===================================================

The following instructions walk you through installing the current django
version of Beacon GuideXML.

1) Obtain Beacon Source Code (django):

Start off by obtaining the beacon source code (django) from git:  

$ git clone git://git.tuxfamily.org/gitroot/beacon/trunk.git
$ cd trunk
$ git checkout --track -b django origin/django
$ ls 
beacon ebuild README.txt

After running the above commands, you should have a 'README.txt' file, a 
directory called 'beacon', and a directory called 'ebuild'.

The 'beacon' directory contains all of the code for the django version of
Beacon GuideXML. 

The 'ebuild' directory contains an ebuild that will eventually be proposed for
inclusion into the Gentoo portage tree. The ebuild does not yet work and is
there for beacon development purposes.

2) Install dependencies:

Beacon GuideXML for django has the following dependencies:

  * django (http://www.djangoproject.com/)
  * 4suite (http://www.4suite.org/)
  * simplejson (http://undefined.org/python/#simplejson)

On gentoo you can easily install these by running the following as root:

$ emerge -va django 4suite simplejson

3) Running the development server:

After you've obtained the beacon code and installed all dependencies you
should now be able to start the beacon development server:

$ cd /path/to/beacon/trunk
$ cd beacon
$ python manage.py runserver

After the server has started, point your web browser to http://localhost:8000
This should give you a login page for beacon. The default username/password is
admin/admin.

NOTE: at this time, beacon is best supported in Firefox3

4) Visiting the administrative interface:

Open your web browser and visit http://localhost:8000/admin.  Enter the
default username and password given in step 3.  This will let you browse and
edit data directly in the database using user-friendly html forms.

NOTE: at this time, beacon is best supported in Firefox3
