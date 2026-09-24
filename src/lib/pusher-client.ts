import PusherClient from "pusher-js";

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY || "key",
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "eu",
    // Private kanallar için abonelik yetkisi sunucudan alınır
    channelAuthorization: {
      endpoint: "/api/pusher/auth",
      transport: "ajax",
    },
  }
);
