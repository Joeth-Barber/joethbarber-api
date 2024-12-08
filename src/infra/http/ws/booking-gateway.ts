import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  },
})
export class BookingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  handleConnection(client: any) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }

  notifyAvailableHoursUpdate(workScheduleId: string, availableHours: string[]) {
    console.log("workScheduleId: ", workScheduleId);
    console.log("availableHours: ", availableHours);

    this.server.emit("availableHoursUpdated", {
      workScheduleId,
      availableHours,
    });
  }
}
