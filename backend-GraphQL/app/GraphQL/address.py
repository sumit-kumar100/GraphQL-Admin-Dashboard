import graphene
from graphene_mongo import MongoengineObjectType
from graphql_relay import from_global_id
from graphene.relay import Node
from graphql_jwt.decorators import login_required
from app.models import Address

# CORE ADDRESS TYPE
class AddressType(MongoengineObjectType):
    class Meta:
        model = Address
        interfaces = (Node,)


# CORE ADDRESS INPUT FIELD FOR MUTATION
class AddressInput(graphene.InputObjectType):
    userId = graphene.ID(required=False)
    houseNo = graphene.String()
    colony = graphene.String()
    landmark = graphene.String()
    pinCode = graphene.Int()
    city = graphene.String()
    state = graphene.String()
    phoneNo = graphene.String()
    alternateNo = graphene.String()


# CORE ADDRESS MUTATION
class AddressMutation(graphene.Mutation):
    address = graphene.Field(AddressType)
    success = graphene.Boolean()

    class Arguments:
        data = AddressInput(required=True)

    @login_required
    def mutate(self, info, data=None):
        if(data.userId):
            userId = data.userId
        else:
            userId = info.context.user.id

        address = Address(
            userId=userId,
            house_no=data.houseNo,
            colony=data.colony,
            landmark=data.landmark,
            pin_code=data.pinCode,
            city=data.city,
            state=data.state,
            phone_number=data.phoneNo,
            alternate_number=data.alternateNo
        )
        address.save()
        return AddressMutation(success=True)



# CORE ADDRESS UPDATE INPUT FIELD FOR MUTATION
class AddressUpdateInput(graphene.InputObjectType):
    id = graphene.ID(required=True)
    userId = graphene.ID(required=False)
    houseNo = graphene.String()
    colony = graphene.String()
    landmark = graphene.String()
    pinCode = graphene.Int()
    city = graphene.String()
    state = graphene.String()
    phoneNo = graphene.String()
    alternateNo = graphene.String()


# CORE CART Update MUTATION
class AddressUpdateMutation(graphene.Mutation):
    address = graphene.Field(AddressType)
    success = graphene.Boolean()

    class Arguments:
        data = AddressUpdateInput(required=True)

    @login_required
    def mutate(self, info, data=None):
        if(data.userId):
            userId = data.userId
        else:
            userId = info.context.user.id

        address = Address.objects.get(id=from_global_id(data.id)[1])

        address.update(
            userId=userId,
            house_no=data.houseNo,
            colony=data.colony,
            landmark=data.landmark,
            pin_code=data.pinCode,
            city=data.city,
            state=data.state,
            phone_number=data.phoneNo,
            alternate_number=data.alternateNo
        )
        address.save()
        return AddressUpdateMutation(success=True)


# ADDRESS DELETE MUTATION
class AddressDeleteMutation(graphene.Mutation):

    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    @login_required
    def mutate(self, info, id):
        address = Address.objects.get(id=from_global_id(id)[1])
        address.delete()
        return AddressDeleteMutation(success=True)


