import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../common/decorators/current-user.decorator';
import { UserGql } from '../graphql/models';
export declare class UsersResolver {
    private readonly prisma;
    constructor(prisma: PrismaService);
    me(auth: AuthUser): Promise<UserGql>;
}
