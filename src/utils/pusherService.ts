// import * as Pusher from 'pusher';

// export class PusherService {
//   private static instance: PusherService = null;

//   private pusher: Pusher;

//   private constructor() {
//     this.pusher = new Pusher({
//       appId: process.env.PUSHER_APP_ID,
//       key: process.env.PUSHER_APP_KEY,
//       secret: process.env.PUSHER_APP_SECRET,
//       cluster: process.env.PUSHER_APP_CLUSTER,
//       useTLS: true,
//     });
//   }

//   authenticate(userId: string, socketId: string) {
//     return this.pusher.authenticateUser(socketId, { id: userId });
//   }

//   authorizeChannel(
//     socketId: any,
//     channelName: any,
//     userData: any,
//     userid: string,
//   ) {
//     return this.pusher.authorizeChannel(socketId, channelName, {
//       user_id: userid,
//       user_info: userData,
//     });
//   }

//   public trigger(channel: string, event: string, data: any) {
//     this.pusher.trigger(channel, event, data);
//   }

//   public static getInstance() {
//     if (this.instance === null) {
//       this.instance = new PusherService();
//     }
//     return this.instance;
//   }
// }
