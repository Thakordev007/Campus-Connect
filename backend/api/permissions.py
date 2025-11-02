from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admins to edit objects.
    """
    def has_permission(self, request, view):
        # Read permissions for any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        
        # Write permissions only for admins
        return request.user.is_authenticated and request.user.is_admin


class IsFacultyOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow faculty and admins to access.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.is_faculty or request.user.is_admin)


class IsFacultyOrAdminOrReadOnly(permissions.BasePermission):
    """
    Read allowed for any authenticated user; write only for faculty/admin.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and (request.user.is_faculty or request.user.is_admin)


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or admins to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions for any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        
        # Write permissions only for the owner or admin
        owner = getattr(obj, 'created_by', None)
        if owner is None:
            # exams use 'faculty' as owner; materials use 'uploaded_by'
            owner = getattr(obj, 'uploaded_by', None) or getattr(obj, 'faculty', None)
        return request.user.is_admin or owner == request.user


class IsStudentOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow students to view their own data.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Students can only view their own results
        if hasattr(obj, 'student'):
            return obj.student == request.user
        return request.user.is_admin or request.user.is_faculty
