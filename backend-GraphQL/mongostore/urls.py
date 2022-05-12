import imp
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from graphene_file_upload.django import FileUploadGraphQLView
from django.contrib import admin
from app import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('graphql/', csrf_exempt(FileUploadGraphQLView.as_view(graphiql=True)))
]

urlpatterns += static(settings.MEDIA_URL, doucment_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, doucment_root=settings.STATIC_ROOT)
