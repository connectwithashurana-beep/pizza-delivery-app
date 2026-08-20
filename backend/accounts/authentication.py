from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError


class OptionalJWTAuthentication(JWTAuthentication):
    """JWTAuthentication that never blocks a request over a bad token.

    Regular JWTAuthentication raises on an invalid/expired/blacklisted
    token, which DRF turns into a 401 for the *whole* request — even on
    views whose permission_classes is AllowAny. That's correct behaviour
    for endpoints where being logged in changes what you can do, but wrong
    for endpoints that are genuinely public read-only browsing (pizza
    listing, etc.): a customer with a stale token sitting in localStorage
    should still be able to see the menu, not get a mysterious 401.

    If the token is missing or invalid, this authenticator just returns
    None (anonymous) instead of raising, so the view falls back to
    AllowAny/anonymous access as intended. A *valid* token still correctly
    identifies the user (so e.g. admin-only write actions on the same
    viewset keep working).
    """

    def authenticate(self, request):
        try:
            return super().authenticate(request)
        except (InvalidToken, TokenError):
            return None
