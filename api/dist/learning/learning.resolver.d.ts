import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../common/decorators/current-user.decorator';
import { CreateLearningActivityInput, CreateLearningSlotInput, LearningActivityGql, LearningSlotGql, UpdateLearningSlotInput } from '../graphql/models';
export declare class LearningResolver {
    private readonly prisma;
    constructor(prisma: PrismaService);
    learningActivities(auth: AuthUser, from?: Date, to?: Date): Promise<LearningActivityGql[]>;
    createLearningActivity(auth: AuthUser, input: CreateLearningActivityInput): Promise<LearningActivityGql>;
    deleteLearningActivity(auth: AuthUser, id: string): Promise<boolean>;
    createLearningSlot(auth: AuthUser, input: CreateLearningSlotInput): Promise<LearningSlotGql>;
    updateLearningSlot(auth: AuthUser, input: UpdateLearningSlotInput): Promise<LearningSlotGql>;
    deleteLearningSlot(auth: AuthUser, id: string): Promise<boolean>;
}
