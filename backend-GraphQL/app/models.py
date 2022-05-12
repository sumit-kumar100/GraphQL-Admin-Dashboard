from mongoengine import *
from users.models import User

# Category , SubCategory and SubList

class Category(Document):
    title = StringField(max_length=200, required=True)



class SubCategory(Document):
    title = StringField(max_length=200, required=True)
    category = ReferenceField('Category', reverse_delete_rule=CASCADE)


class SubList(Document):
    title = StringField(max_length=200, required=True)
    sub_category = ReferenceField('SubCategory', reverse_delete_rule=CASCADE)


# Product , Images and Its Variant Model
class ProductImage(Document):
    image = ImageField(thumbnail_size=(165, 165, True))


class ProductVariant(EmbeddedDocument):
    images = ListField(ReferenceField(ProductImage))
    color = StringField(max_length=100, required=True)
    size = StringField(max_length=100, required=True)
    listPrice = FloatField(required=True)
    quantity = FloatField(required=True)


class Product(Document):
    meta = {'collection': 'product'}
    sublist = ReferenceField('SubList', reverse_delete_rule=CASCADE)
    title = StringField(max_length=200, required=True)
    brand = StringField(max_length=200, required=True)
    description = StringField(required=True)
    mrp = FloatField(required=True)
    list_price = FloatField(required=True)
    cost = FloatField(required=True)
    quantity = IntField(required=True)
    gst_included = BooleanField(default=True)
    images = ListField(ReferenceField(ProductImage))
    colors = ListField(StringField(max_length=100))
    sizes = ListField(StringField(max_length=100))
    variants = EmbeddedDocumentListField(ProductVariant)
    userId = IntField(required=True)
    status = BooleanField(default=True)

# CART


class CartProduct(EmbeddedDocument):
    product = ReferenceField(Product)
    variant = DictField()
    quantity = IntField(required=True)


class Cart(Document):
    userId = IntField(required=True)
    products = EmbeddedDocumentListField(CartProduct)


# Address

class Address(Document):
    userId = IntField(required=True)
    house_no = StringField(required=True)
    colony = StringField(required=True)
    landmark = StringField(required=True)
    pin_code = IntField()
    city = StringField(required=True)
    state = StringField(required=True)
    phone_number = StringField(max_length=20, required=True)
    alternate_number = StringField(max_length=20, required=True)


# ORDERS

class Order(Document):
    userId = IntField(required=True)
    address = ReferenceField(Address)
    product = ReferenceField(Product)
    variant = DictField()
    quantity = IntField(required=True)
    order_status = StringField(max_length=100, required=True)
