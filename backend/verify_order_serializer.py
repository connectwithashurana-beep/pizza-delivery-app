import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
import django
django.setup()
from orders.serializers import CreateOrderSerializer
from rest_framework.request import Request
from rest_framework.test import APIRequestFactory
from django.contrib.auth import get_user_model
from orders.models import Order

User = get_user_model()
user = User.objects.first()
factory = APIRequestFactory()
wsgi_request = factory.post('/api/orders/', {'delivery_address':'Test','contact_number':'123','items':[{'base_id':1,'sauce_id':1,'cheese_id':1,'quantity':1}]})
wsgi_request.user = user
request = Request(wsgi_request)
serializer = CreateOrderSerializer(data=request.data, context={'request': request})
print('valid=', serializer.is_valid())
if serializer.is_valid():
    order = serializer.save()
    print('created_order_id=', order.id)
    print('order_count=', Order.objects.count())
else:
    print('errors=', serializer.errors)
