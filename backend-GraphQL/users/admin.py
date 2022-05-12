from django.contrib import admin
from .models import User,Merchant,Customer


admin.site.register(User)
admin.site.register(Merchant)
admin.site.register(Customer)