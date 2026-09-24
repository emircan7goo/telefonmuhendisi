import PusherServer from "pusher";

// Use global to prevent multiple instances in development
const globalForPusher = global as unknown as { pusherServer: PusherServer };

export const pusherServer =
  globalForPusher.pusherServer ||
  new PusherServer({
    appId: process.env.PUSHER_APP_ID || "app-id",
    key: process.env.NEXT_PUBLIC_PUSHER_KEY || "key",
    secret: process.env.PUSHER_SECRET || "secret",
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "eu",
    useTLS: true,
  });

if (process.env.NODE_ENV !== "production") globalForPusher.pusherServer = pusherServer;
