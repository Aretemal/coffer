import { Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import { UserGql } from '../graphql/models';

@Resolver(() => UserGql)
export class UsersResolver {
  constructor(private readonly prisma: PrismaService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => UserGql)
  async me(@CurrentUser() auth: AuthUser): Promise<UserGql> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: auth.userId },
      select: { id: true, email: true, name: true },
    });
    return user;
  }
}
