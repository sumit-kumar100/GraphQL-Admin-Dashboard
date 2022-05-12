import graphene
from graphene_mongo import MongoengineObjectType
from graphql_relay import from_global_id
from graphql_jwt.decorators import login_required,superuser_required
from graphene.relay import Node
from app.models import Category, SubCategory, SubList

# CATEGORY TYPE


class CategoryType(MongoengineObjectType):
    class Meta:
        model = Category
        interfaces = (Node,)


# CATEGORY MUTATION
class CategoryMutation(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        title = graphene.String()

    # @superuser_required
    def mutate(self, info, title):
        Category.objects.create(title=title)
        return CategoryMutation(success=True)

# CATEGORY UPDATE MUTATION


class CategoryUpdateMutation(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        id = graphene.ID(required=True)
        title = graphene.String()

    @superuser_required
    def mutate(self, info, id, title):
        category = Category.objects.get(id=from_global_id(id)[1])
        category.update(title=title)
        category.save()
        return CategoryUpdateMutation(success=True)

# CATEGORY DELETE MUTATION


class CategoryDeleteMutation(graphene.Mutation):

    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    @superuser_required
    def mutate(self, info, id):
        category = Category.objects.get(id=from_global_id(id)[1])
        category.delete()
        return CategoryDeleteMutation(success=True)


# SUBCATEGORY TYPE
class SubCategoryType(MongoengineObjectType):
    class Meta:
        model = SubCategory
        interfaces = (Node,)


# SUBCATEGORY MUTATION
class SubCategoryMutation(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        category = graphene.ID()
        title = graphene.String()

    @superuser_required
    def mutate(self, info, category, title):
        category = Category.objects.get(id=from_global_id(category)[1])
        SubCategory.objects.create(category=category, title=title)
        return SubCategoryMutation(success=True)

# SUBCATEGORY UPDATE MUTATION


class SubCategoryUpdateMutation(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        id = graphene.ID(required=True)
        category = graphene.ID()
        title = graphene.String()

    @superuser_required
    def mutate(self, info, id, category, title):
        category = Category.objects.get(id=from_global_id(category)[1])
        subcategory = SubCategory.objects.get(id=from_global_id(id)[1])
        subcategory.update(category=category, title=title)
        subcategory.save()
        return SubCategoryUpdateMutation(success=True)

# SUBCATEGORY DELETE MUTATION


class SubCategoryDeleteMutation(graphene.Mutation):

    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    @superuser_required
    def mutate(self, info, id):
        subcategory = SubCategory.objects.get(id=from_global_id(id)[1])
        subcategory.delete()
        return SubCategoryDeleteMutation(success=True)


# SUBLIST TYPE
class SubListType(MongoengineObjectType):
    class Meta:
        model = SubList
        interfaces = (Node,)


class SubListMutation(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        subcategory = graphene.ID()
        title = graphene.String()
    
    @superuser_required
    def mutate(self, info, subcategory, title):
        subcategory = SubCategory.objects.get(id=from_global_id(subcategory)[1])
        SubList.objects.create(sub_category=subcategory, title=title)
        return SubListMutation(success=True)


# SUBLIST UPDATE MUTATION


class SubListUpdateMutation(graphene.Mutation):
    success = graphene.Boolean()
    
    class Arguments:
        id = graphene.ID(required=True)
        subcategory = graphene.ID()
        title = graphene.String()

    @superuser_required
    def mutate(self, info, id, subcategory, title):
        subcategory = SubCategory.objects.get(
            id=from_global_id(subcategory)[1])
        sublist = SubList.objects.get(id=from_global_id(id)[1])
        sublist.update(sub_category=subcategory, title=title)
        sublist.save()
        return SubListUpdateMutation(success=True)

# SUBLIST DELETE MUTATION


class SubListDeleteMutation(graphene.Mutation):

    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    @superuser_required
    def mutate(self, info, id):
        sublist = SubList.objects.get(id=from_global_id(id)[1])
        sublist.delete()
        return SubListDeleteMutation(success=True)



