# from rest_framework import permissions

# class IsOwnerOrReadOnly(permissions.BasePermission):
#     """
#     Custom permission to only allow owners of an object to edit it.
#     """
    
#     def has_object_permission(self, request, view, obj):
#         # Read permissions are allowed to any request,
#         # so we'll always allow GET, HEAD or OPTIONS requests.
#         if request.method in permissions.SAFE_METHODS:
#             return True

#         # Write permissions are only allowed to the owner of the snippet.
#         # obj.created_by is the ForeignKey we just added
#         return obj.created_by == request.user
    

from rest_framework import permissions

class IsStudentOwner(permissions.BasePermission):
    """
    Allow read to anyone authenticated, but write only to the owner.
    Assumes Student has an 'owner' field.
    """

    def has_object_permission(self, request, view, obj):
        # Safe methods (GET/HEAD/OPTIONS) allowed for any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write allowed only to owner
        return obj.owner == request.user


from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Read for anyone authenticated, write only for staff/admin.
    """

    def has_permission(self, request, view):
        # Allow safe methods for any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated

        # Non-safe methods only for staff/admin
        return request.user and request.user.is_staff


class IsCourseOwnerOrStaff(permissions.BasePermission):
    """
    Staff can do anything; non-staff only on their own Course objects.
    """

    def has_object_permission(self, request, view, obj):
        if request.user and request.user.is_staff:
            return True
        return getattr(obj, "owner_id", None) == getattr(request.user, "id", None)

