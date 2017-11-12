# class ObjectPermissionsBackend(object):

#     def has_perm(self, user_obj, perm, obj=None):
#         print("at backend")
#         if not obj:
#             return False # not dealing with non-object permissions

#         if perm == 'view':
#             return True # anyone can view
#         elif obj.author_id == user_obj.pk:
#             return True
#         else:
#             return False

from rest_framework import permissions
 
 
class IsStaffOrTargetUser(permissions.BasePermission):
    def has_permission(self, request, view):
        # allow user to list all users if logged in user is staff
        return view.action == 'retrieve' or request.user.is_staff
 
    def has_object_permission(self, request, view, obj):
        # allow logged in user to view own details, allows staff to view all records
        return request.user.is_staff or obj == request.user



SAFE_METHODS = ['POST', 'HEAD', 'OPTIONS']

class IsAuthenticatedOrCreateOnly(permissions.BasePermission):
    """
    The request is authenticated as a user, or is a read-only request.
    """

    def has_permission(self, request, view):
        if (request.method in SAFE_METHODS or
            request.user and
            request.user.is_authenticated()):
            return True
        return False