from django.contrib.auth.models import User
from django.conf import settings
from django.db import models
from django.contrib import admin
from django.template import Context, loader, RequestContext
from random import choice
from xml.dom.ext.reader import Sax2
from xml import xpath
from xml.dom.ext import Print
from Ft.Xml.Xslt import Processor
from Ft.Xml import InputSource
import StringIO
import urllib2
import re


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


	def parse_html_document(self, html_document):
		html_document = html_document.replace("<br>", "<br />").replace("<hr>", "<hr />") # I WOULDN'T DO A THING LIKE THAT.  IT MUST HAVE BEEN CHEATER McCHEATERSON!
		html_document = re.sub(r'<style.*>.*</style>', '', html_document) # BAD CHEATER McCHEATERSON!
		htmlsource = InputSource.DefaultFactory.fromString(html_document)
		xsltsource = InputSource.DefaultFactory.fromUri(settings.XSLT_DIR + "/html2guide.xsl")

		#f = open("/home/randerson/liquidus/beacon/test.txt", 'w')
		#f.write(htmlsource.read())
		#f.close()
		htmlsource.stream.reset()

		processor = Processor.Processor()
		processor.appendStylesheet(xsltsource)
		result = processor.run(htmlsource)

		return self.parse_document(result)


	def parse_document(self, xml_document):
		reader = Sax2.Reader()
		reader.parser.setFeature("http://xml.org/sax/features/external-general-entities",False)
		doc = reader.fromString(xml_document)

		doc_elem = doc.documentElement

		try:
			lang = xpath.Evaluate('attribute::lang', doc_elem)[0].nodeValue.strip()
		except IndexError:
			lang = None

		try:
			link = xpath.Evaluate('attribute::link', doc_elem)[0].nodeValue.strip()
		except IndexError:
			link = None

		title = xpath.Evaluate('child::title/child::text()', doc_elem)[0].nodeValue.strip()

		author_nodes = xpath.Evaluate('child::author', doc_elem)
		authors = []

		for a in author_nodes:
			atitle = xpath.Evaluate('attribute::title', a)[0].nodeValue.strip()
			try:
				mail_node = xpath.Evaluate('child::mail', a)[0]
				aemail = xpath.Evaluate('attribute::link', mail_node)[0].nodeValue.strip()
				try:
					aname = xpath.Evaluate('child::text()', mail_node)[0].nodeValue.strip()
				except:
					aname = aemail
			except:
				aemail = None
				aname = xpath.Evaluate('child::text()', a)[0].nodeValue.strip()
			authors.append({'title':atitle.strip(), 'email':aemail, 'name':aname.strip()})

		abstract = xpath.Evaluate('child::abstract/child::text()', doc_elem)[0].nodeValue.strip()

		license_node = xpath.Evaluate('child::license', doc_elem)
		if len(license_node) > 0:
			license = True
		else:
			license = False

		version = xpath.Evaluate('child::version/child::text()', doc_elem)[0].nodeValue.strip()
		date = xpath.Evaluate('child::date/child::text()', doc_elem)[0].nodeValue.strip()

		chapter_nodes = xpath.Evaluate('child::chapter', doc_elem)
		chapters = []

		for c in chapter_nodes:
			ctitle = xpath.Evaluate('child::title/child::text()', c)[0].nodeValue.strip()

			section_nodes = xpath.Evaluate('child::section', c)
			sections = []

			for s in section_nodes:
				stitle = xpath.Evaluate('child::title/child::text()', s)[0].nodeValue.strip()

				sio = StringIO.StringIO()

				Print(xpath.Evaluate('child::body', s)[0], sio)

				body = sio.getvalue().strip()
				
				sections.append({'title':stitle, 'body':body})

			chapters.append({'title':ctitle, 'sections':sections})

		document = {'title':title, 'link':link, 'language':lang, 'abstract':abstract, 'date':date, 'version':version, 'authors':authors, 'chapters':chapters}

		return document


	def split_name(self, name):
		middle_name = None
		last_name = ""
		split = name.strip().split(" ")
		if len(split) == 2:
			(first_name, last_name) = split
		elif len(split) == 3:
			(first_name, middle_name, last_name) = split
		elif len(split) > 3:
			(first_name, middle_name, last_name) = (split[0], " ".join(split[1:-1]), split[-1])
		else:
			first_name = name

		return (first_name, middle_name, last_name)


	def create_document(self, document, id=None, doc_key=None):

		doc = None
		
		document = document.copy()
		chapters = document['chapters']
		del document['chapters']
		authors = document['authors']
		del document['authors']

		if doc_key is not None and id is None:
			# todo put a try around this get (check permissions?)
			id = self.get(doc_key=doc_key).id
			document['doc_key'] = doc_key

		if id is not None:
			# todo put a try around this get (check permissions?)
			doc = self.get(id=id)
			doc.author_set.all().delete()
			doc.chapter_set.all().delete()
			document['id'] = id

		#doc = self.create(**document)
		# let django decide whether to insert or update
		doc = Document(**document)
		doc.save()

		for a in authors:
			(first_name, middle_name, last_name) = self.split_name(a['name'])
			author = doc.author_set.create(title=a['title'], email=a['email'], first_name=first_name, middle_name=middle_name, last_name=last_name)

		corder = 1
		for c in chapters:
			chap = doc.chapter_set.create(title=c['title'], order=corder)
			sorder = 1
			for s in c['sections']:
				sect = chap.section_set.create(title=s['title'], body=s['body'], order=sorder)
				sorder += 1
			corder += 1

		return doc


	def create_new_document(self, title, author, abstract, date, logged_in, user=None):
		doc = self.create(title=title, abstract=abstract, date=date)

		(first_name, middle_name, last_name) = self.split_name(author)

		auth = doc.author_set.create(first_name=first_name, middle_name=middle_name, last_name=last_name)

		chap = doc.chapter_set.create(title="Chapter 1", order=1)

		sect = chap.section_set.create(title="Section 1", order=1, body="<p>Test Paragraph!</p>")

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
	version = models.CharField(max_length=25, null=True, blank=True)
	last_action = models.DateTimeField(auto_now=True)
	doc_key = models.CharField(max_length=16, unique=True)
	
	objects = DocumentManager()

	def render(self, template, request):
		t = loader.get_template(template)
		c = RequestContext(request, {'document': self})
		return t.render(c)

	def to_xml(self, request):
		return self.render("editor/docoutput/doc_xml.xml", request)

	def to_html(self, request):
		return self.render("editor/docoutput/doc_html.html", request)

	def __unicode__(self):
		return self.title
	
	def __init__(self, *args, **kwargs):
		try:
			doc_key = kwargs['doc_key']
		except:
			doc_key = None
			while doc_key is None or self.__class__.objects.filter(doc_key=doc_key).count() > 0:	
				doc_key = self.__class__.objects.make_random_key()
			
		kwargs['doc_key']=doc_key

		return super(Document, self).__init__(*args, **kwargs)


class Author(models.Model):
	document = models.ForeignKey('Document')
	title = models.CharField(max_length=100, null=True, blank=True)
	first_name = models.CharField(max_length=100)
	last_name = models.CharField(max_length=100)
	middle_name = models.CharField(max_length=100, null=True, blank=True)
	email = models.EmailField(null=True, blank=True)

	def render(self, template, request):
		t = loader.get_template(template)
		c = RequestContext(request, {'author': self})
		return t.render(c)

	def to_xml(self, request):
		return self.render("editor/docoutput/author_xml.xml", request)
	
	def to_html(self, request):
		return self.render("editor/docoutput/author_html.html", request)
	
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
	
	def render(self, template, request):
		t = loader.get_template(template)
		c = RequestContext(request, {'chapter': self})
		return t.render(c)

	def to_xml(self, request):
		return self.render("editor/docoutput/chapter_xml.xml", request)
	
	def to_html(self, request):
		return self.render("editor/docoutput/chapter_html.html", request)

	def __unicode__(self):
		return self.title

	class Meta:
		ordering = ('order',)


class Section(models.Model):
	chapter = models.ForeignKey('Chapter')
	title = models.CharField(max_length=500)
	body = models.XMLField()
	order = models.PositiveIntegerField()
	
	def render(self, template, request):
		t = loader.get_template(template)
		c = RequestContext(request, {'section': self})
		return t.render(c)

	def to_xml(self, request):
		return self.render("editor/docoutput/section_xml.xml", request)

	def to_html(self, request):
		return self.render("editor/docoutput/section_html.html", request)
		
	def set_body_html(self, html):
		#TODO: Fix unicode support.
		htmlsource = InputSource.DefaultFactory.fromString("<div title=\"guideBody\">" + str(html) + "</div>")
		xsltsource = InputSource.DefaultFactory.fromUri(settings.XSLT_DIR + "/html2guide-sectionbody.xsl")

		processor = Processor.Processor()
		processor.appendStylesheet(xsltsource)
		result = processor.run(htmlsource)

		result = result[result.find('>')+1:result.rfind('<')]
		
		self.body = result
		return result
	
	def set_body_xml(self, xml):
		self.body = xml
		return xml
	
	def get_body_html(self):
		#TODO: Fix unicode support.
		xmlsource = InputSource.DefaultFactory.fromString("<body>" + str(self.body) + "</body>")
		xsltsource = InputSource.DefaultFactory.fromUri(settings.XSLT_DIR + "/guide2html-sectionbody.xsl")

		processor = Processor.Processor()
		processor.appendStylesheet(xsltsource)
		result = processor.run(xmlsource)

		result[result.find('>')+1:result.rfind('<')]

		return result

	def get_body_xml(self):
		return self.body

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

