from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_save
from django.dispatch import receiver

roles = (
    ('ADMIN', 'ADMIN'),
    ('MERCHANT', 'MERCHANT'),
    ('CUSTOMER', 'CUSTOMER')
)


class User(AbstractUser):
    email = models.EmailField(_('email address'), unique=True)
    role = models.CharField(max_length=10, choices=roles, default='ADMIN')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'role']


class Merchant(models.Model):
    company_name = models.CharField(max_length=255, null=True, blank=True)
    company_pan_no = models.CharField(max_length=255, null=True, blank=True)
    gst_no = models.CharField(max_length=255, null=True, blank=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)


class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if(instance.role == 'MERCHANT'):
            merchant = Merchant.objects.create(user=instance)
            merchant.save()
        elif(instance.role == 'CUSTOMER'):
            customer = Customer.objects.create(user=instance)
            customer.save()
        else:
            pass
