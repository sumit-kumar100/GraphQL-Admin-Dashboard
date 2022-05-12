from itertools import product
import graphene
from graphene.relay import Node
from graphene_mongo import MongoengineConnectionField
from graphql_relay import from_global_id
from graphene.types.generic import GenericScalar
from app.GraphQL.address import AddressDeleteMutation, AddressMutation, AddressType, AddressUpdateMutation
from app.models import Cart, Order, Product, Category, SubCategory, SubList, Address
from app.GraphQL.product import ProductType, ProductMutation, ProductUpdateMutation, ProductDeleteMutation
from app.GraphQL.category import CategoryType, SubCategoryMutation, SubCategoryType, SubListMutation, SubListType, CategoryMutation, CategoryUpdateMutation, CategoryDeleteMutation, SubCategoryUpdateMutation, SubCategoryDeleteMutation, SubListUpdateMutation, SubListDeleteMutation
from users.schema import DeleteUser, UpdateCustomerUser, UpdateMerchantUser, UserType, CreateMerchantUser, CreateCustomerUser, ObtainJSONWebToken, VerifyToken, RefreshToken
from users.models import User
from app.GraphQL.cart import CartType, CartMutation, CartUpdateMutation, CartDeleteMutation
from app.GraphQL.order import OrderType, OrderMutation, OrderUpdateMutation, OrderDeleteMutation
from graphql_jwt.decorators import login_required, superuser_required


# GraphQl Queries
class Query(graphene.ObjectType):
    node = Node.Field()

    # Product Queries
    products = MongoengineConnectionField(ProductType)

    @login_required
    def resolve_products(self, info):
        if info.context.user.role == 'ADMIN':
            return Product.objects.all()
        else:
            return Product.objects.filter(userId=info.context.user.id)

    product_by_id = graphene.Field(ProductType, id=graphene.ID())

    @login_required
    def resolve_product_by_id(root, info, id):
        return Product.objects.get(id=from_global_id(id)[1])

    # Users Queries
    users = graphene.List(UserType)

    @superuser_required
    def resolve_users(self, info):
        return User.objects.all()

    user_by_id = graphene.Field(UserType, id=graphene.ID())

    @login_required
    def resolve_user_by_id(root, info, id):
        return User.objects.get(id=id)

    # Categories Queries
    category = MongoengineConnectionField(CategoryType)

    @superuser_required
    def resolve_category(root, info):
        return Category.objects.all()

    category_by_id = graphene.Field(CategoryType, id=graphene.ID())

    @login_required
    def resolve_category_by_id(root, info, id):
        return Category.objects.get(id=from_global_id(id)[1])

    # Subcategories Queries
    subcategory = MongoengineConnectionField(SubCategoryType)

    @superuser_required
    def resolve_subcategory(root, info):
        return SubCategory.objects.all()

    subcategory_by_id = graphene.Field(SubCategoryType, id=graphene.ID())

    @login_required
    def resolve_subcategory_by_id(root, info, id):
        print(SubCategory.objects.all()[0].id)
        return SubCategory.objects.get(id=from_global_id(id)[1])

    # Sublist Queries
    sublist = MongoengineConnectionField(SubListType)

    @login_required
    def resolve_sublist(root, info):
        return SubList.objects.all()

    sublist_by_id = graphene.Field(SubListType, id=graphene.ID())

    @login_required
    def resolve_sublist_by_id(root, info, id):
        return SubList.objects.get(id=from_global_id(id)[1])

    # Card Queries
    carts = MongoengineConnectionField(CartType)

    @login_required
    def resolve_carts(root, info):
        return Cart.objects.all()

    cart_by_id = graphene.Field(CartType, id=graphene.ID())

    @login_required
    def resolve_cart_by_id(root, info, id):
        return Cart.objects.get(id=from_global_id(id)[1])

    # Order Queries
    orders = MongoengineConnectionField(OrderType)

    @login_required
    def resolve_orders(root, info):
        if info.context.user.role == 'ADMIN':
            return Order.objects.all()
        else:
            return Order.objects.filter(product__in=Product.objects.filter(userId=info.context.user.id))

    order_by_id = graphene.Field(OrderType, id=graphene.ID())

    @login_required
    def resolve_order_by_id(root, info, id):
        return Order.objects.get(id=from_global_id(id)[1])

    # Address Queries
    address = MongoengineConnectionField(AddressType)

    @login_required
    def resolve_address(root, info):
        return Address.objects.all()

    query_address = graphene.List(AddressType, filters=GenericScalar())

    def resolve_query_address(root, info, filters):
        return Address.objects.filter(**filters)

    address_by_id = graphene.Field(AddressType, id=graphene.ID())

    @login_required
    def resolve_address_by_id(root, info, id):
        return Address.objects.get(id=from_global_id(id)[1])


# GraphQl Mutations
class Mutation(graphene.ObjectType):

    # Product Mutation
    create_product = ProductMutation.Field()
    update_product = ProductUpdateMutation.Field()
    delete_product = ProductDeleteMutation.Field()

    # Category Mutation
    create_category = CategoryMutation.Field()
    update_category = CategoryUpdateMutation.Field()
    delete_category = CategoryDeleteMutation.Field()

    # SubCategory Mutation
    create_subcategory = SubCategoryMutation.Field()
    update_subcategory = SubCategoryUpdateMutation.Field()
    delete_subcategory = SubCategoryDeleteMutation.Field()

    # SubList Mutation
    create_sublist = SubListMutation.Field()
    update_sublist = SubListUpdateMutation.Field()
    delete_sublist = SubListDeleteMutation.Field()

    # Cart Mutations
    create_cart = CartMutation.Field()
    update_cart = CartUpdateMutation.Field()
    delete_cart = CartDeleteMutation.Field()

    # Order Mutations
    create_order = OrderMutation.Field()
    update_order = OrderUpdateMutation.Field()
    delete_order = OrderDeleteMutation.Field()

    # Address Mutations
    create_address = AddressMutation.Field()
    update_address = AddressUpdateMutation.Field()
    delete_address = AddressDeleteMutation.Field()

    # User Mutation
    create_merchant = CreateMerchantUser.Field()
    update_merchant = UpdateMerchantUser.Field()
    create_customer = CreateCustomerUser.Field()
    update_customer = UpdateCustomerUser.Field()
    delete_user = DeleteUser.Field()

    # Users JWT Mutation
    token_auth = ObtainJSONWebToken.Field()
    verify_token = VerifyToken.Field()
    refresh_token = RefreshToken.Field()


# Schema
schema = graphene.Schema(
    query=Query,
    mutation=Mutation,
    types=[ProductType, SubListType]
)
