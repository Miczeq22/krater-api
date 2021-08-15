export abstract class Query<Payload extends object = {}> {
  constructor(public readonly type: string, public readonly payload: Payload) {}
}
