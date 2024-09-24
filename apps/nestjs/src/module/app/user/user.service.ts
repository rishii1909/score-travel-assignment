import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ORY_ROLES } from "apps/nestjs/src/common/ory";
import { User } from "apps/nestjs/src/entities/User";
import { Repository } from "typeorm";

interface CreateUserProps {
  email: string;
  oryIdentityId: string;
  roles: ORY_ROLES[];
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async updateUser(
    oryIdentityId: string,
    updateData: Partial<CreateUserProps>
  ): Promise<User | null> {
    await this.userRepository.update({ oryIdentityId }, updateData);

    return this.userRepository.findOne({ where: { oryIdentityId } });
  }

  async upsertUser({
    email,
    oryIdentityId,
    roles,
  }: CreateUserProps): Promise<User> {
    const foundUser = await this.findUserByOryIdentityId(oryIdentityId);

    if (foundUser) {
      return (await this.updateUser(oryIdentityId, { email, roles }))!;
    } else {
      const newUser = this.userRepository.create({
        email,
        oryIdentityId,
        roles,
      });
      return this.userRepository.save(newUser);
    }
  }

  async findUserByOryIdentityId(oryIdentityId: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { oryIdentityId } });
  }

  async listUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }
}
