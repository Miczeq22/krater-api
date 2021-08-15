import * as Awilix from 'awilix';

export const registerAsArray = <T>(resolvers: Awilix.Resolver<T>[]): Awilix.Resolver<T[]> => ({
  resolve: (container: Awilix.AwilixContainer) => resolvers.map((r) => container.build(r)),
});
