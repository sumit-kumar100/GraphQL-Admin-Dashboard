from django.contrib.auth import get_user_model
from graphene_django import DjangoObjectType
from .models import Merchant, Customer
from graphql_jwt.shortcuts import create_refresh_token, get_token
from datetime import datetime
from users.models import User
import graphene
from graphql_jwt.settings import jwt_settings
from calendar import timegm
import graphql_jwt


class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()


# Token Auth Overwritten which also sends user data along with token
class ObtainJSONWebToken(graphql_jwt.JSONWebTokenMutation):
    user = graphene.Field(UserType)

    @classmethod
    def resolve(cls, root, info, **kwargs):
        return cls(user=info.context.user)

# Verify Auth Token Overwritten which also sends user data along with token


class VerifyToken(graphql_jwt.Verify):
    user = graphene.Field(UserType)

    @classmethod
    def resolve(cls, root, info, **kwargs):
        return cls(user=info.context.user)


# Refresh Auth Token Overwriteen which also sends data along with token
class RefreshToken(graphql_jwt.Refresh):
    user = graphene.Field(UserType)

    @classmethod
    def resolve(cls, root, info, **kwargs):
        return cls(user=info.context.user)


# Merchant Profile
class MerchantType(DjangoObjectType):
    class Meta:
        model = Merchant


# Merchant Mutations Input
class MerchantUserInput(graphene.InputObjectType):
    firstName = graphene.String(required=False)
    lastName = graphene.String(required=False)
    email = graphene.String(required=True)
    password = graphene.String(required=True)
    companyName = graphene.String(required=True)
    companyPanNo = graphene.String(required=True)
    gstNo = graphene.String(required=True)


# Merchant Mutations
class CreateMerchantUser(graphene.Mutation):
    user = graphene.Field(UserType)
    profile = graphene.Field(MerchantType)
    token = graphene.String()
    refresh_token = graphene.String()
    success = graphene.Boolean()

    class Arguments:
        data = MerchantUserInput(required=True)

    def mutate(self, info, data):
        user = get_user_model()(
            first_name=data.firstName,
            last_name=data.lastName,
            email=data.email,
            username=data.email,
            role='MERCHANT'
        )
        user.set_password(data.password)
        user.save()

        merchant = Merchant.objects.get(user=user.id)
        merchant.company_name = data.companyName
        merchant.company_pan_no = data.companyPanNo
        merchant.gst_no = data.gstNo
        merchant.save()

        token = get_token(user)
        refresh_token = create_refresh_token(user)

        return CreateMerchantUser(success=True, user=user, profile=merchant, token=token, refresh_token=refresh_token)

# Merchant Update Mutations Input


class MerchantUpdateUserInput(graphene.InputObjectType):
    id = graphene.ID()
    firstName = graphene.String(required=False)
    lastName = graphene.String(required=False)
    email = graphene.String(required=True)
    companyName = graphene.String(required=True)
    companyPanNo = graphene.String(required=True)
    gstNo = graphene.String(required=True)


# Merchant Update Mutations
class UpdateMerchantUser(graphene.Mutation):
    user = graphene.Field(UserType)
    profile = graphene.Field(MerchantType)
    success = graphene.Boolean()

    class Arguments:
        data = MerchantUpdateUserInput(required=True)

    def mutate(self, info, data):
        user = User.objects.get(id=data.id)
        user.first_name = data.firstName
        user.last_name = data.lastName
        user.email = data.email
        user.save()

        merchant = Merchant.objects.get(user=user.id)
        merchant.company_name = data.companyName
        merchant.company_pan_no = data.companyPanNo
        merchant.gst_no = data.gstNo
        merchant.save()

        return UpdateMerchantUser(success=True, user=user, profile=merchant)


# Customer
class CustomerType(DjangoObjectType):
    class Meta:
        model = Customer


# Customer Mutations Input
class CustomerUserInput(graphene.InputObjectType):
    firstName = graphene.String(required=False)
    lastName = graphene.String(required=False)
    email = graphene.String(required=True)
    password = graphene.String(required=True)


# Customer Mutations
class CreateCustomerUser(graphene.Mutation):
    user = graphene.Field(UserType)
    profile = graphene.Field(CustomerType)
    token = graphene.String()
    refresh_token = graphene.String()
    success = graphene.Boolean()

    class Arguments:
        data = CustomerUserInput(required=True)

    def mutate(self, info, data):
        user = get_user_model()(
            first_name=data.firstName,
            last_name=data.lastName,
            email=data.email,
            username=data.email,
            role='CUSTOMER'
        )
        user.set_password(data.password)
        user.save()

        customer = Customer.objects.get(user=user.id)

        token = get_token(user)
        refresh_token = create_refresh_token(user)

        return CreateCustomerUser(success=True, user=user, profile=customer, token=token, refresh_token=refresh_token)


# Customer Update Mutations Input
class CustomerUpdateUserInput(graphene.InputObjectType):
    id = graphene.ID()
    firstName = graphene.String(required=False)
    lastName = graphene.String(required=False)
    email = graphene.String(required=True)


# Customer Update Mutations
class UpdateCustomerUser(graphene.Mutation):
    user = graphene.Field(UserType)
    profile = graphene.Field(CustomerType)
    success = graphene.Boolean()

    class Arguments:
        data = CustomerUpdateUserInput(required=True)

    def mutate(self, info, data):
        user = User.objects.get(id=data.id)
        user.first_name = data.firstName
        user.last_name = data.lastName
        user.email = data.email
        user.save()
        customer = Customer.objects.get(user=user.id)
        return UpdateCustomerUser(success=True, user=user, profile=customer)



# Delete User Mutation
class DeleteUser(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
    success = graphene.Boolean()
    def mutate(self, info, id):
        user = User.objects.get(id=id)
        user.delete()
        return DeleteUser(success=True)


def jwt_payload(user, context=None):
    username = user.get_username()

    if hasattr(username, "pk"):
        username = username.pk

    exp = datetime.utcnow() + jwt_settings.JWT_EXPIRATION_DELTA

    payload = {
        user.USERNAME_FIELD: username,
        "role": user.role,
        "exp": timegm(exp.utctimetuple()),
    }

    if jwt_settings.JWT_ALLOW_REFRESH:
        payload["origIat"] = timegm(datetime.utcnow().utctimetuple())

    if jwt_settings.JWT_AUDIENCE is not None:
        payload["aud"] = jwt_settings.JWT_AUDIENCE

    if jwt_settings.JWT_ISSUER is not None:
        payload["iss"] = jwt_settings.JWT_ISSUER

    return payload
