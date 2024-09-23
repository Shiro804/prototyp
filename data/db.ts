import { EntityManager } from "@mikro-orm/core";
import { MikroORM } from "@mikro-orm/sqlite";

import config from "./mikro-orm.config";

const typedGlobal = global as unknown as {
  db?: EntityManager;
};

export async function getDb() {
  if (typedGlobal.db) {
    return typedGlobal.db.fork();
  }

  const db = await MikroORM.init(config);
  await db.schema.updateSchema();
  typedGlobal.db = db.em;
  return typedGlobal.db.fork();
}
