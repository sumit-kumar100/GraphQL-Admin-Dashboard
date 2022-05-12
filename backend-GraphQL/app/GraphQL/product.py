import graphene
from graphene_mongo import MongoengineObjectType
from graphene.types.generic import GenericScalar
from graphql_relay import from_global_id
from graphene.relay import Node
from graphql_jwt.decorators import login_required
from app.models import Product, ProductVariant, ProductImage, SubList

# CORE PRODUCT TYPE


class ProductType(MongoengineObjectType):
    class Meta:
        model = Product
        interfaces = (Node,)
        filter_fields = {}


# CORE PRODUCT INPUT FIELD FOR MUTATION
class ProductInput(graphene.InputObjectType):
    sublist = graphene.ID()
    title = graphene.String(required=True)
    brand = graphene.String(required=True)
    description = graphene.String(required=True)
    mrp = graphene.Float()
    list_price = graphene.Float()
    cost = graphene.Float()
    quantity = graphene.Int()
    gst_included = graphene.Boolean()
    images = GenericScalar()
    colors = GenericScalar()
    sizes = GenericScalar()
    variants = GenericScalar()
    status = graphene.Boolean()


# CORE PRODUCT MUTATION
class ProductMutation(graphene.Mutation):
    product = graphene.Field(ProductType)
    success = graphene.Boolean()

    class Arguments:
        data = ProductInput(required=True)

    @login_required
    def mutate(self, info, data=None):
        # Product Image
        if(info.context.user.role == 'ADMIN' or info.context.user.role == 'MERCHANT'):
            productImageReferece = []
            for image in data.images:
                imageRef = ProductImage.objects.create(image=image)
                productImageReferece.append(imageRef)

            # Product Variant and Image
            for variant in data.variants:
                productVariantImageReferece = []
                for image in variant.get('images'):
                    imageRef = ProductImage.objects.create(image=image)
                    productVariantImageReferece.append(imageRef)
                variant.update({'images': productVariantImageReferece})

            product = Product(
                sublist=SubList.objects.get(id=from_global_id(data.sublist)[1]),
                title=data.title,
                brand=data.brand,
                description=data.description,
                mrp=data.mrp,
                list_price=data.list_price,
                cost=data.cost,
                quantity=data.quantity,
                gst_included=data.gst_included,
                images=productImageReferece,
                colors=data.colors,
                sizes=data.sizes,
                variants=data.variants,
                userId=info.context.user.id,
                status=data.status
            )
            product.save()
            return ProductMutation(success=True)
        else:
            return ProductMutation(success=False)


# CORE PRODUCT UPDATE INPUT FIELD FOR MUTATION
class ProductUpdateInput(graphene.InputObjectType):
    id = graphene.ID(required=True)
    sublist = graphene.ID()
    title = graphene.String(required=True)
    brand = graphene.String(required=True)
    description = graphene.String(required=True)
    mrp = graphene.Float()
    list_price = graphene.Float()
    cost = graphene.Float()
    quantity = graphene.Int()
    gst_included = graphene.Boolean()
    images = GenericScalar()
    colors = GenericScalar()
    sizes = GenericScalar()
    variants = GenericScalar()
    status = graphene.Boolean()


# CORE PRODUCT MUTATION
class ProductUpdateMutation(graphene.Mutation):
    product = graphene.Field(ProductType)
    success = graphene.Boolean()

    class Arguments:
        data = ProductUpdateInput(required=True)

    @login_required
    def mutate(self, info, data=None):
        if (info.context.user.role == 'ADMIN' or info.context.user.role == 'MERCHANT'):
            # Getting Old Product Data
            product = Product.objects.get(id=from_global_id(data.id)[1])

            # Deleting Old Product Images
            for image in product.images:
                image.delete()

            # Deleting Old Product Variant Images
            for variant in product.variants:
                for image in variant.images:
                    image.delete()

            # New Product Image
            productImageReferece = []
            for image in data.images:
                imageRef = ProductImage.objects.create(image=image)
                productImageReferece.append(imageRef)

            # New Product Variant and Image
            for variant in data.variants:
                productVariantImageReferece = []
                for image in variant.get('images'):
                    imageRef = ProductImage.objects.create(image=image)
                    productVariantImageReferece.append(imageRef)
                variant.update({'images': productVariantImageReferece})
                
            product.update(
                sublist=SubList.objects.get(id=from_global_id(data.sublist)[1]),
                title=data.title,
                brand=data.brand,
                description=data.description,
                mrp=data.mrp,
                list_price=data.list_price,
                cost=data.cost,
                quantity=data.quantity,
                gst_included=data.gst_included,
                images=productImageReferece,
                colors=data.colors,
                sizes=data.sizes,
                variants=data.variants,
                userId=info.context.user.id,
                status=data.status
            )
            product.save()
            return ProductUpdateMutation(success=True)
        else:
            ProductUpdateMutation(success=False)


class ProductDeleteMutation(graphene.Mutation):

    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    @login_required
    def mutate(self, info, id):
        if (info.context.user.role == 'ADMIN' or info.context.user.role == 'MERCHANT'):
            product = Product.objects.get(id=from_global_id(id)[1])

            # Deleting Images
            for image in product.images:
                image.delete()

            # Deleting Variant Images
            for variant in product.variants:
                for image in variant.images:
                    image.delete()

            product.delete()

            return ProductDeleteMutation(success=True)
        else:
            return ProductDeleteMutation(success=False)


# PRODUCT VARIANT TYPE
class ProductVariantType(MongoengineObjectType):
    class Meta:
        model = ProductVariant
        interfaces = (Node,)


# PRODUCT IMAGE TYPE
class ProductImageType(MongoengineObjectType):
    class Meta:
        model = ProductImage
        interfaces = (Node,)
