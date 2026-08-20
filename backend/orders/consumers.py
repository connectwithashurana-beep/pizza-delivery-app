import json
from urllib.parse import parse_qs
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError


class OrderStatusConsumer(AsyncWebsocketConsumer):
    """Streams live status updates for a single order.

    Previously this accepted every connection unconditionally and joined the
    order's broadcast group without checking who was asking — since the SPA
    authenticates with JWTs (not Django session cookies), scope["user"] from
    AuthMiddlewareStack is always AnonymousUser here, so in practice *anyone*
    could open ws/orders/<any_id>/ and watch that order's status change,
    including orders that belong to someone else. The frontend never even
    sent a token on this connection.

    Now the frontend passes the JWT access token as a query param
    (?token=...), and the consumer validates it and checks that the
    requesting user owns the order (or is staff) before accepting.
    """

    async def connect(self):
        self.order_id = self.scope["url_route"]["kwargs"]["order_id"]
        self.group_name = f"order_{self.order_id}"

        query_string = self.scope.get("query_string", b"").decode()
        token = parse_qs(query_string).get("token", [None])[0]

        user = await self._get_user_from_token(token)
        if user is None:
            await self.close(code=4401)
            return

        owns_order = await self._user_can_view_order(user, self.order_id)
        if not owns_order:
            await self.close(code=4403)
            return

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    @database_sync_to_async
    def _get_user_from_token(self, token):
        if not token:
            return None
        try:
            validated = AccessToken(token)
        except TokenError:
            return None
        from accounts.models import User
        try:
            return User.objects.get(id=validated["user_id"])
        except User.DoesNotExist:
            return None

    @database_sync_to_async
    def _user_can_view_order(self, user, order_id):
        from .models import Order
        if getattr(user, "role", None) in ("admin", "superadmin"):
            return Order.objects.filter(id=order_id).exists()
        return Order.objects.filter(id=order_id, user=user).exists()

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def order_status_update(self, event):
        await self.send(text_data=json.dumps({"status": event["status"], "order_id": self.order_id}))
