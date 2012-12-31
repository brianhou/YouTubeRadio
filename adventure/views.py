# Create your views here.
from django.shortcuts import render_to_response
from django.template import RequestContext

def index(request):
    return render_to_response('adventure/index.html', RequestContext(request))

def play(request):
    return render_to_response('adventure/play.html', RequestContext(request))
