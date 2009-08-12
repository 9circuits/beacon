import fedora.client
import sys

uname = sys.argv[1]
passy = sys.argv[2]

obj = fedora.client.AccountSystem(base_url='https://admin.fedoraproject.org/accounts/')

if obj.verify_password(uname,passy) == True:
    print "yes"
else:
    print "no"