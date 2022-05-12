from pathlib import Path
import mongoengine
import os
from decouple import config
 

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-*0%#3fjctu6_8!i@v7=(cq0m=6_ycuvet1v0g4^00ga$!da$0+'

DEBUG = True

ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'graphene_django',
    'django_filters',
    'graphql_jwt.refresh_token.apps.RefreshTokenConfig',
    'app',
    'users'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'mongostore.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'mongostore.wsgi.application'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# SQL Database for Users
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

# Default Static Root
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATIC_URL = '/static/'

# Allowed Host
# CORS_ALLOWED_ORIGINS = [env('ALLOWED_HOST')]
CORS_ALLOW_ALL_ORIGINS = True


# Default Media Root
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

# SIMPLY UNCOMMENT BELOW CODE FOR LOCALHOST MONGODB

# _MONGODB_USER = ""
# _MONGODB_PASSWD = ""
# _MONGODB_HOST = "localhost"
# _MONGODB_NAME = "mongostore"                          # Database Name
# _MONGODB_PORT = 27017
# _MONGODB_DATABASE_HOST = "mongodb://%s:%s@%s/%s" % (
#     _MONGODB_USER,
#     _MONGODB_PASSWD,
#     _MONGODB_HOST,
#     _MONGODB_NAME,
# )
# mongoengine.connect(_MONGODB_NAME, host=_MONGODB_HOST, port=_MONGODB_PORT)

# FOR MONGODB ATLAS
MONGODB_USERNAME = config('MONGODB_USERNAME')
MONGODB_PASSWORD = config('MONGODB_PASSWORD')
MONGODB_DATABASE = config('MONGODB_DATABASE')

mongoengine.connect(MONGODB_DATABASE,host=f'mongodb+srv://{MONGODB_USERNAME}:{MONGODB_PASSWORD}@cluster0.zuifn.mongodb.net/?retryWrites=true&w=majority')


# Graphlql Schema Location
GRAPHENE = {
    "SCHEMA": "app.schema.schema",
    "MIDDLEWARE": [
        "graphql_jwt.middleware.JSONWebTokenMiddleware"
    ]
}

# Authentication Backends
AUTHENTICATION_BACKENDS = [
    'graphql_jwt.backends.JSONWebTokenBackend',
    "django.contrib.auth.backends.ModelBackend"
]

# Custom GraphQL JWT Payload
GRAPHQL_JWT = {
    'JWT_PAYLOAD_HANDLER': 'users.schema.jwt_payload'
}


# Email Backend
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Auth User Model
AUTH_USER_MODEL = "users.User"
