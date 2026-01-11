from rest_framework import serializers
from .models import Student

# class StudentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Student
#         fields = ['id', 'name', 'age', 'email'] # We select which fields to expose


# class StudentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Student
#         fields = ['id', 'name', 'age', 'email']

#     def to_representation(self, instance):
#         # Get the original data
#         data = super().to_representation(instance)
#         # Modify the data
#         data['name'] = f"Mr. {data['name']}"
#         data['is_adult'] = instance.age >= 18 # We can even add fields that aren't in the model!
#         return data

    # def to_internal_value(self, data):
    #     # data is the raw incoming dict from request
    #     # 1) Extract nested meta.accept_terms if present
    #     meta = data.get("meta") or {}
    #     if "accept_terms" in meta and "accept_terms" not in data:
    #         data = data.copy()
    #         data["accept_terms"] = meta["accept_terms"]

    #     # 2) Normalize name (e.g. capitalize)
    #     if "name" in data and isinstance(data["name"], str):
    #         data = data.copy()
    #         data["name"] = data["name"].strip().title()

    #     # Then let DRF run normal field validation
    #     return super().to_internal_value(data)

    # def validate(self, attrs):
    #     # attrs is the dict of cleaned values for all fields
    #     if not attrs.get("accept_terms"):
    #         raise serializers.ValidationError({"accept_terms": "You must accept terms."})

    #     age = attrs.get("age")
    #     email = attrs.get("email")

    #     if age is not None and email and age < 18:
    #         if not email.endswith("@gmail.com"):
    #             raise serializers.ValidationError(
    #                 {"email": "Under 18 must use a gmail.com address."}
    #             )

    #     return attrs

# from rest_framework import serializers
# from django.core.validators import MaxValueValidator, MinValueValidator
# from .models import Student

# class StudentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Student
#         fields = ['id', 'name', 'age', 'email']

#     # Built-in field validators
#     age = serializers.IntegerField(
#         validators=[
#             MinValueValidator(5, message="Minimum age is 5"),  # No toddlers in academy!
#             MaxValueValidator(100, message="Maximum age is 100")  # No immortals!
#         ]
#     )
    
#     # Email must be unique
#     email = serializers.EmailField(validators=[ serializers.UniqueValidator(queryset=Student.objects.all()) ])


# students/serializers.py
from .validators import adult_student_validator, valid_student_name
from rest_framework.validators import UniqueValidator  # <-- add this
from .validators import validate_academy_email

class StudentSerializer(serializers.ModelSerializer):
    # email = serializers.EmailField(
    #     validators=[
    #         UniqueValidator(
    #             queryset=Student.objects.all(),
    #             message="This email is already registered."
    #         )
    #     ]
    # )
#     email = serializers.EmailField(
#     validators=[
#         UniqueValidator(queryset=Student.objects.all()),
#         validate_academy_email,
#     ]
# )
    class Meta:
        model = Student
        fields = '__all__'

    def create(self, validated_data):
        print("create called")
        # you could pop or add extra fields here
        student = Student.objects.create(**validated_data)
        print(f"[SERIALIZER] Created student {student.name} with age {student.age}")
        return student

    def update(self, instance, validated_data):
        # apply changes
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        print(f"[SERIALIZER] Updated student {instance.id}, age now {instance.age}")
        return instance

    name = serializers.CharField(validators=[valid_student_name])
    age = serializers.IntegerField(validators=[adult_student_validator])
    email = serializers.EmailField(validators=[UniqueValidator(queryset=Student.objects.all())])



# from rest_framework import serializers
# from .models import Student

# class StudentSerializer(serializers.Serializer):
#     id = serializers.IntegerField(read_only=True)
#     name = serializers.CharField(max_length=100)
#     age = serializers.IntegerField()
#     email = serializers.EmailField()

#     def to_representation(self, instance):
#         data = {
#             'id': instance.id,
#             'name': f"Mr. {instance.name}",
#             'age': instance.age,
#             'email': instance.email,
#             'is_adult': instance.age >= 18,
#         }
#         return data

#     def create(self, validated_data):
#         # called by serializer.save() in perform_create
#         return Student.objects.create(**validated_data)

#     def update(self, instance, validated_data):
#         instance.name = validated_data.get('name', instance.name)
#         instance.age = validated_data.get('age', instance.age)
#         instance.email = validated_data.get('email', instance.email)
#         instance.save()
#         return instance


from rest_framework import serializers
from .models import Course
from .validators import validate_non_negative_price


class CourseSerializer(serializers.ModelSerializer):
    price = serializers.DecimalField(
    max_digits=8,
    decimal_places=2,
    validators=[validate_non_negative_price],
)
    class Meta:
        model = Course
        fields = ["id", "title", "description", "price", "is_published", "created_at"]
        read_only_fields = ["created_at"]

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price cannot be negative.")
        return value
