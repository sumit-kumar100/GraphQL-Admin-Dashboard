import json
import graphene
from graphene_mongo import MongoengineObjectType
from graphene.types.generic import GenericScalar
from graphql_relay import from_global_id
from graphene.relay import Node
from graphql_jwt.decorators import login_required
from app.models import Cart, CartProduct, Product

# CORE CART TYPE


class CartType(MongoengineObjectType):
    class Meta:
        model = Cart
        interfaces = (Node,)


# CORE CART INPUT FIELD FOR MUTATION
class CartInput(graphene.InputObjectType):
    userId = graphene.ID(required=False)
    products = GenericScalar()


# CORE CART MUTATION
class CartMutation(graphene.Mutation):
    cart = graphene.Field(CartType)
    success = graphene.Boolean()

    class Arguments:
        data = CartInput(required=True)

    @login_required
    def mutate(self, info, data=None):
        if(data.userId):
            userId = data.userId
        else:
            userId = info.context.user.id

        for item in data.products:
            product = Product.objects.get(
                id=from_global_id(item.get('product'))[1])
            item.update({
                'product': product,
                'variant': json.loads(item.get('variant'))
            })
        cart = Cart(
            userId=userId,
            products=data.products
        )
        cart.save()
        return CartMutation(success=True)

# CORE CART UPDATE INPUT FIELD FOR MUTATION


class CartUpdateInput(graphene.InputObjectType):
    id = graphene.ID(required=True)
    userId = graphene.ID(required=False)
    products = GenericScalar()


# CORE CART Update MUTATION
class CartUpdateMutation(graphene.Mutation):
    product = graphene.Field(CartType)
    success = graphene.Boolean()

    class Arguments:
        data = CartUpdateInput(required=True)

    @login_required
    def mutate(self, info, data=None):
        if(data.userId):
            userId = data.userId
        else:
            userId = info.context.user.id

        for item in data.products:
            product = Product.objects.get(
                id=from_global_id(item.get('product'))[1])
            item.update({
                'product': product,
                'variant': json.loads(item.get('variant'))
            })

        cart = Cart.objects.get(id=from_global_id(data.id)[1])
        cart.update(
            userId=userId,
            products=data.products
        )
        cart.save()
        return CartUpdateMutation(success=True)


# CART DELETE MUTATION
class CartDeleteMutation(graphene.Mutation):

    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    @login_required
    def mutate(self, info, id):
        cart = Cart.objects.get(id=from_global_id(id)[1])
        cart.delete()
        return CartDeleteMutation(success=True)


# CART PRODUCT TYPE
class CartProuductType(MongoengineObjectType):
    class Meta:
        model = CartProduct
        interfaces = (Node,)
