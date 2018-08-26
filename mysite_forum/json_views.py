import json

from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseRedirect
from django.views.decorators.http import require_http_methods
from django.core import serializers
from django.contrib.auth.decorators import login_required

from mysite_forum.models import Thread, Post, Reply

@login_required
@require_http_methods(['GET'])
def fetch_threads(request):

    threads = Thread.objects.all()

    json_threads = serializers.serialize('json', threads)

    return HttpResponse(json.dumps(json_threads), content_type='application/json')