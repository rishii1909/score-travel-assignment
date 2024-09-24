// src/roles/roles.service.ts

import { Injectable } from "@nestjs/common";
import { OryRelationShipsClient } from "apps/nestjs/src/clients/ory-clients";
import { ORY_RELATIONS, ORY_ROLES } from "apps/nestjs/src/common/ory";

@Injectable()
export class RolesService {
  async addRole(identityId: string, role: ORY_ROLES): Promise<void> {
    await OryRelationShipsClient.createRelationship({
      createRelationshipBody: {
        namespace: role,
        object: role,
        relation: ORY_RELATIONS.memberOf,
        subject_id: identityId,
      },
    });
  }

  async removeRole(identityId: string, role: ORY_ROLES): Promise<void> {
    await OryRelationShipsClient.deleteRelationships({
      namespace: role,
      object: role,
      relation: ORY_RELATIONS.memberOf,
      subjectId: identityId,
    });
  }

  async getRoles(identityId: string): Promise<ORY_ROLES[]> {
    const response = await OryRelationShipsClient.getRelationships({
      relation: ORY_RELATIONS.memberOf,
      subjectId: identityId,
    });

    const objects = response.data.relation_tuples?.map((tuple) => tuple.object);

    const roles: ORY_ROLES[] =
      objects?.filter((object): object is ORY_ROLES =>
        Object.values(ORY_ROLES).includes(object as ORY_ROLES)
      ) || [];

    return roles;
  }
}
