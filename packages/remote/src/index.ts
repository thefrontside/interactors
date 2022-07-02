/* eslint-disable @typescript-eslint/no-explicit-any */
import { Operation, spawn } from '@effection/core';
import { addInteractionWrapper } from '@interactors/globals';
import { InteractorConstructor, Interactor } from '@interactors/core';
import { createWebSocketServer, WebSocketConnection, WebSocketServer } from '@effection/websocket-server';
import { createWebSocketClient, WebSocketClient } from '@effection/websocket-client';
import { createDispatch } from '@effection/dispatch';
import { v4 as uuid } from 'uuid';

type ServerMessage = {
  key: string;
  name: string;
  args: unknown[];
  options: SerializedOptions,
};

type ClientMessage = {
  key: string;
  status: "success" | "error";
  value?: unknown;
  error?: string;
};

// TODO: we should change InteractionOptions in core so it is more easily serializable
type SerializedOptions = {
  name: string;
  locator: string | undefined;
  filters: Record<string, unknown>;
  ancestors: SerializedOptions[];
}

function serializeOptions(options: Interactor<any, any>['options']): SerializedOptions {
  return {
    name: options.name,
    locator: options.locator?.value as string | undefined,
    filters: options.filter.filters,
    ancestors: options.ancestors.map(serializeOptions),
  }
}

export function connect(url: string): Operation<void> {
  return {
    *init() {
      let client: WebSocketClient<ClientMessage, ServerMessage> = yield createWebSocketClient(url);
      let dispatch = createDispatch<string, ClientMessage>();

      addInteractionWrapper<any>(function*(perform, interaction) {
        let key = uuid();
        let interactor = interaction.interactor as Interactor<any, any>;
        yield client.send({
          key,
          name: interaction.options.name,
          args: interaction.options.args,
          options: serializeOptions(interactor.options),
        });

        let reply: ClientMessage = yield dispatch.get(key).expect();
        if(reply.status === 'error') {
          throw new Error(reply.error || "unknown error");
        } else {
          return reply.value as any;
        }
      })

      yield spawn(client.forEach(function*(message) {
        dispatch.send(message.key, message);
      }));
    }
  }
}

export function* serve(port: number, interactors: InteractorConstructor<any, any, any, any>[]): Operation<void> {
  let map = new Map(interactors.map((i) => [i.interactorName, i]));
  console.log('[server] strarting...');
  let server: WebSocketServer<ServerMessage, ClientMessage> = yield createWebSocketServer({ port });

  console.log(`[server] started! Listening on port ${port}`);

  while(true) {
    let connection: WebSocketConnection<ServerMessage, ClientMessage> = yield server.first();
    if(!connection) break;

    yield spawn(connection.forEach(({ options, key, name, args }) => function*() {
      try {
        console.log('[server] received request', key, options);
        let constructor = map.get(options.name);
        if(!constructor) throw new Error(`no such interactor: ${options.name}`);

        let interactor = options.locator ?
          constructor(options.locator, options.filters) :
          constructor(options.filters);

        let value = yield interactor[name](...args);

        console.log('[server] success', key);
        yield connection.send({ key, status: "success", value });
      } catch(error: any) {
        console.log('[server] error', key);
        yield connection.send({ key, status: "error", error: error.message });
      }
    }));
  }
}
