from django.contrib.auth.models import User
from django.conf import settings
from django.db import models
from django.contrib import admin
from django.template import Context, loader
from random import choice
from xml.dom.ext.reader import Sax2
from xml import xpath
from xml.dom.ext import Print
import StringIO
import urllib2


class ParseException(Exception):
	pass




class DocumentManager(models.Manager):
	def parse_url(self, xml_url):
		try:
			urlfd = urllib2.urlopen(xml_url)
			content = ''.join(urlfd.readlines())
		except  Exception, e:
			raise ParseException(e)
		return self.parse_document(content)


	def parse_document(self, xml_document):
		reader = Sax2.Reader()
		reader.parser.setFeature("http://xml.org/sax/features/external-general-entities",False)
		doc = reader.fromString(xml_document)

		doc_elem = doc.documentElement

		try:
			lang = xpath.Evaluate('attribute::lang', doc_elem)[0].nodeValue
		except IndexError:
			lang = None

		try:
			link = xpath.Evaluate('attribute::link', doc_elem)[0].nodeValue
		except IndexError:
			link = None

		title = xpath.Evaluate('child::title/child::text()', doc_elem)[0].nodeValue

		author_nodes = xpath.Evaluate('child::author', doc_elem)
		authors = []

		for a in author_nodes:
			atitle = xpath.Evaluate('attribute::title', a)[0].nodeValue
			try:
				mail_node = xpath.Evalutate('child::mail', a)[0]
				aemail = xpath.Evalutate('attribute::link', mail_node)[0].nodeValue
				aname = xpath.Evalute('child::text()', mail_node)[0].nodeValue
			except:
				aemail = None
				aname = xpath.Evaluate('child::text()', a)[0].nodeValue
			authors.append({'title':atitle, 'email':aemail, 'name':aname})

		abstract = xpath.Evaluate('child::abstract/child::text()', doc_elem)[0].nodeValue

		license_node = xpath.Evaluate('child::license', doc_elem)
		if len(license_node) > 0:
			license = True
		else:
			license = False

		version = xpath.Evaluate('child::version/child::text()', doc_elem)[0].nodeValue
		date = xpath.Evaluate('child::date/child::text()', doc_elem)[0].nodeValue

		chapter_nodes = xpath.Evaluate('child::chapter', doc_elem)
		chapters = []

		for c in chapter_nodes:
			ctitle = xpath.Evaluate('child::title/child::text()', c)[0].nodeValue

			section_nodes = xpath.Evaluate('child::section', c)
			sections = []

			for s in section_nodes:
				stitle = xpath.Evaluate('child::title/child::text()', s)[0].nodeValue

				sio = StringIO.StringIO()

				Print(xpath.Evaluate('child::body', s)[0], sio)

				body = sio.getvalue()
				
				sections.append({'title':stitle, 'body':body})

			chapters.append({'title':ctitle, 'sections':sections})

		document = {'title':title, 'link':link, 'language':lang, 'abstract':abstract, 'date':date, 'version':version, 'chapters':chapters}

		return document
	

	def create_document(self, document):
		document = document.copy()
		chapters = document['chapters']
		del document['chapters']

		key = self.make_random_key()

		key_unique = False

		while not key_unique:
			try:
				doc = self.create(key=key, **document)
				doc.save()
				key_unique = True
			except:
				key = self.make_random_key()

		corder = 1
		for c in chapters:
			chap = Chapter(document=doc, title=c['title'], order=corder)
			chap.save()
			sorder = 1
			for s in c['sections']:
				sect = Section(chapter=chap, title=s['title'], body=s['body'], order=sorder)
				sect.save()
				sorder += 1
			corder += 1

		return doc


	def create_new_document(self, title, author, abstract, date, logged_in, user=None):
		doc = self.create(title=title, abstract=abstract, date=date)

		middle_name = None
		split = author.split(" ")
		if len(split) == 2:
			(first_name, last_name) = split
		elif len(split) == 3:
			(first_name, middle_name, last_name) = split
		elif len(split) > 3:
			middle_name = " ".join(split[1:-1])
			first_name = split[0]
			last_name = split[-1]
		else:
			first_name = author
			last_name = ""

		auth = doc.author_set.create(first_name=first_name, middle_name=middle_name, last_name=last_name)

		if user is not None:
			username = user.username
		else:
			username = "guest"

		docuser = doc.documentuser_set.create(username=username, logged_in=logged_in, user=user)

		return doc


	def make_random_key(self):
		chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
		return ''.join([choice(chars) for i in range(16)])


class DocumentUser(models.Model):
	documents = models.ManyToManyField('Document')
	username = models.CharField(max_length=50, null=True, blank=True)
	last_user_update = models.DateTimeField(auto_now=True)
	logged_in = models.BooleanField()
	user = models.ForeignKey('auth.User', null=True, blank=True)

	def __unicode__(self):
		return self.username


class Document(models.Model):
	title = models.TextField()
	link = models.URLField(verify_exists=False, null=True, blank=True)
	language = models.CharField(max_length=50, null=True, blank=True)
	abstract = models.TextField()
	date = models.DateField()
	version = models.CharField(max_length=25)
	last_action = models.DateTimeField(auto_now=True)
	key = models.CharField(max_length=16, unique=True)
	
	objects = DocumentManager()

	def render(self, template):
		t = loader.get_template(template)
		c = Context({'document': self})
		return t.render(c)

	def to_xml(self):
		return self.render("docoutput/doc_xml.xml")

	def to_html(self):
		return self.render("docoutput/doc_html.html")

	def __unicode__(self):
		return self.title


class Author(models.Model):
	document = models.ForeignKey('Document')
	title = models.CharField(max_length=100, null=True, blank=True)
	first_name = models.CharField(max_length=100)
	last_name = models.CharField(max_length=100)
	middle_name = models.CharField(max_length=100, null=True, blank=True)
	email = models.EmailField(null=True, blank=True)

	def render(self, template):
		t = loader.get_template(template)
		c = Context({'author': self})
		return t.render(c)

	def to_xml(self):
		return self.render("docoutput/author_xml.xml")
	
	def to_html(self):
		return self.render("docoutput/author_html.html")
	
	def name(self):
		if self.middle_name is not None:
			return self.first_name + " " + self.middle_name + " " + self.last_name
		else:
			return self.first_name + " " + self.last_name

	def __unicode__(self):
		return self.first_name + " " + self.last_name


class Chapter(models.Model):
	document = models.ForeignKey('Document')
	title = models.CharField(max_length=500)
	order = models.PositiveIntegerField()
	
	def render(self, template):
		t = loader.get_template(template)
		c = Context({'chapter': self})
		return t.render(c)

	def to_xml(self):
		return self.render("docoutput/chapter_xml.xml")
	
	def to_html(self):
		return self.render("docoutput/chapter_html.html")

	def __unicode__(self):
		return self.title

	class Meta:
		ordering = ('order',)


class Section(models.Model):
	chapter = models.ForeignKey('Chapter')
	title = models.CharField(max_length=500)
	body = models.XMLField()
	order = models.PositiveIntegerField()
	
	def render(self, template):
		t = loader.get_template(template)
		c = Context({'section': self})
		return t.render(c)

	def to_xml(self):
		return self.render("docoutput/section_xml.xml")

	def to_html(self):
		return self.render("docoutput/section_html.html")

	def __unicode__(self):
		return self.title

	class Meta:
		ordering = ('order',)


class ChatEntry(models.Model):
	timestamp = models.DateTimeField()
	document = models.ForeignKey('Document')
	user = models.ForeignKey('DocumentUser')
	message = models.TextField()

	class Meta:
		verbose_name_plural = "menu entries"

