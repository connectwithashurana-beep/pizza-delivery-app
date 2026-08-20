from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


def broadcast_order_status(order_id, status):
    channel_layer = get_channel_layer()
    if channel_layer is None:
        return
    async_to_sync(channel_layer.group_send)(
        f"order_{order_id}",
        {"type": "order_status_update", "status": status},
    )
