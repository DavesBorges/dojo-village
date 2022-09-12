import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from "@nestjs/websockets";
import { ActionsService } from "./actions.service";
import { CreateActionDto } from "./dto/create-action.dto";
import { UpdateActionDto } from "./dto/update-action.dto";
import { Server, Socket } from "socket.io";
import { Action } from "./entities/action.entity";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ActionsGateway {
  constructor(private readonly actionsService: ActionsService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage("joinCombat")
  joinCombat(@MessageBody() message, @ConnectedSocket() client: Socket) {
    const name = message.name;
    console.log({ name });
    client.emit("yourCharacter", this.actionsService.identify(name, client.id));
  }

  @SubscribeMessage("createAction")
  create(@MessageBody() createActionDto: CreateActionDto) {
    return this.actionsService.create(createActionDto);
  }

  @SubscribeMessage("performAction")
  async performAction(
    @MessageBody() body: Action,
    @ConnectedSocket() client: Socket
  ) {
    const action = body;
    await this.actionsService.processAction(action, client.id);
    this.server.emit("update", {
      characters: this.actionsService.getCharacters(),
    });

    client.broadcast.emit("actionPerformed", {
      skillId: action.skillId,
    });
  }

  @SubscribeMessage("getCharacters")
  getCharacters() {
    return this.server.emit(
      "getCharacters",
      this.actionsService.getCharacters()
    );
  }
}
