from rest_framework import permissions

class IsStudentOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_staff

class IsCourseOwnerOrStaff(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user and request.user.is_staff:
            return True
        return getattr(obj, "owner_id", None) == getattr(request.user, "id", None)

# ← NEW: Enrollment Permissions
class IsEnrollmentOwner(permissions.BasePermission):
    """Allow read to anyone, write only to student owner or staff"""
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        # Staff can do anything
        if request.user and request.user.is_staff:
            return True
        # Only student owner can modify their enrollments
        return obj.student.owner == request.user

class IsStudentOwnerOrStaff(permissions.BasePermission):
    """Either student owner OR staff"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return obj.owner == request.user
