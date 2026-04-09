import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../common/decorators/current-user.decorator';
import { AddItemListRowInput, CreateItemListInput, ItemListGql, ItemListRowGql, RenameItemListInput } from '../graphql/models';
export declare class ListsResolver {
    private readonly prisma;
    constructor(prisma: PrismaService);
    itemLists(auth: AuthUser): Promise<ItemListGql[]>;
    createItemList(auth: AuthUser, input: CreateItemListInput): Promise<ItemListGql>;
    renameItemList(auth: AuthUser, input: RenameItemListInput): Promise<ItemListGql>;
    deleteItemList(auth: AuthUser, id: string): Promise<boolean>;
    addItemListRow(auth: AuthUser, input: AddItemListRowInput): Promise<ItemListRowGql>;
    deleteItemListRow(auth: AuthUser, id: string): Promise<boolean>;
}
