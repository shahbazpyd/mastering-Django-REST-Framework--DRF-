# students/validators.py
from rest_framework.validators import UniqueValidator
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator

def adult_student_validator(age):
    """Custom: Students must be 18+ for advanced courses"""
    if age < 18:
        raise ValidationError('Advanced courses require students to be 18+ years old.')

def valid_student_name(value):
    """Custom: Names must start with capital letter, no numbers"""
    name_regex = RegexValidator(
        regex=r'^[A-Z][a-zA-Z\s]*$',
        message="Name must start with capital letter and contain only letters/spaces"
    )
    return name_regex(value)




from rest_framework import serializers


def validate_academy_email(value):
    """
    Only allow emails from specific domains.
    """
    allowed_domains = ["gmail.com", "yahoo.com", "academy.com"]
    domain = value.split("@")[-1]
    if domain not in allowed_domains:
        raise serializers.ValidationError(
            f"Email domain must be one of: {', '.join(allowed_domains)}."
        )
    return value


def validate_non_negative_price(value):
    """
    Ensure price is >= 0.
    """
    if value < 0:
        raise serializers.ValidationError("Price cannot be negative.")
    return value
