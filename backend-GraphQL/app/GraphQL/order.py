import json
import graphene
from graphene_mongo import MongoengineObjectType
from graphene.types.generic import GenericScalar
from graphql_relay import from_global_id
from graphene.relay import Node
from graphql_jwt.decorators import login_required
from app.models import Address, Order, Product

# CORE ORDER TYPE


class OrderType(MongoengineObjectType):
    class Meta:
        model = Order
        interfaces = (Node,)


# CORE ORDER INPUT FIELD FOR MUTATION
class OrderInput(graphene.InputObjectType):
    userId = graphene.ID(required=False)
    addressId = graphene.ID(required=True)
    products = GenericScalar()
    orderStatus = graphene.String()


# CORE ORDER MUTATION
class OrderMutation(graphene.Mutation):
    order = graphene.Field(OrderType)
    success = graphene.Boolean()

    class Arguments:
        data = OrderInput(required=True)

    @login_required
    def mutate(self, info, data=None):
        if(data.userId):
            userId = data.userId
        else:
            userId = info.context.user.id

        address = Address.objects.get(id=from_global_id(data.addressId)[1])

        for item in data.products:
            product = Product.objects.get(
                id=from_global_id(item.get('product'))[1])

            variant = item.get('variant')
            if(variant == {}):
                variant = {"listPrice": product.list_price}
            else:
                variant = json.loads(variant)
            order = Order(
                userId=userId,
                address=address,
                product=product,
                variant=variant,
                quantity=item.get('quantity'),
                order_status=data.orderStatus
            )
            order.save()
        return OrderMutation(success=True)


# CORE ORDER UPDATE INPUT FIELD FOR MUTATION
class OrderUpdateInput(graphene.InputObjectType):
    id = graphene.ID(required=True)
    orderStatus = graphene.String()


# CORE ORDER UPDATE MUTATION
class OrderUpdateMutation(graphene.Mutation):
    product = graphene.Field(OrderType)
    success = graphene.Boolean()

    class Arguments:
        data = OrderUpdateInput(required=True)

    @login_required
    def mutate(self, info, data=None):
        order = Order.objects.get(id=from_global_id(data.id)[1])
        order.update(order_status=data.orderStatus)
        order.save()
        return OrderUpdateMutation(success=True)


# ORDER DELETE MUTATION
class OrderDeleteMutation(graphene.Mutation):

    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    @login_required
    def mutate(self, info, id):
        order = Order.objects.get(id=from_global_id(id)[1])
        order.delete()
        return OrderDeleteMutation(success=True)
