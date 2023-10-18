from rest_framework import permissions


class IsOwnerOnly(permissions.BasePermission):
    """
    Записи могут редактировать только их владельцы.
    """

    def has_permission(self, request, view):
        if request.method == "POST":
            return request.user and request.user.is_authenticated
        return True

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.subscriber == request.user


class IsOwnerOrModOrReadOnly(permissions.BasePermission):
    """
    Пользователи могут редактировать только свои записи.
    Админы могут редактировать все записи.
    Для всех остальных запросы только на чтение (GET).
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj == request.user or request.user.is_staff


class IsModOrReadOnly(permissions.BasePermission):
    """
    Админы могут выполнять любые действия.
    Для всех остальных запросы только на чтение (GET).
    """
    def has_permission(self, request, view):
        return request.user.is_staff or request.method in permissions.SAFE_METHODS


class IsSuperuserOrReadOnly(permissions.BasePermission):
    """
    Суперпользователи могут выполнять любые действия.
    Для всех остальных запросы только на чтение (GET).
    """
    def has_permission(self, request, view):
        return request.user.is_superuser or request.method in permissions.SAFE_METHODS


class UserPatchPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Любой пользователь может менять любое СВОЕ поле, кроме is_active, is_staff и is_superuser
        if request.method == 'PATCH' and request.user == obj:
            allowed_fields = {'username', 'email', 'password', 'status', 'avatar'}
            changed_fields = set(request.data.keys())
            if not (changed_fields - allowed_fields):
                return True

        # Модератор
        if request.user.is_staff and not request.user.is_superuser:
            # Модератор дополнительно может менять is_active у пользователей, которые не являются модераторами или администраторами
            if request.method == 'PATCH' and 'is_active' in request.data and obj != request.user:
                if not obj.is_staff and not obj.is_superuser:
                    return True

        # Администратор
        if request.user.is_superuser:
            # Администратор может менять is_active у пользователей, которые являются модераторами
            if request.method == 'PATCH' and 'is_active' in request.data and obj.is_staff and not obj.is_superuser:
                return True

            # Администратор может менять поле is_staff у всех кроме администраторов и себя
            if request.method == 'PATCH' and 'is_staff' in request.data and obj != request.user and not obj.is_superuser:
                return True

        return False






