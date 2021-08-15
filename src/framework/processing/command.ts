export abstract class Command<Payload extends object = {}> {
  constructor(public readonly type: string, public readonly payload: Payload) {}
}
