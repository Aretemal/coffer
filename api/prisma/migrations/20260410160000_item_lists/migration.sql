-- CreateTable
CREATE TABLE "ItemList" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemListRow" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "listId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemListRow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ItemList_userId_createdAt_idx" ON "ItemList"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ItemListRow_listId_sortOrder_idx" ON "ItemListRow"("listId", "sortOrder");

-- AddForeignKey
ALTER TABLE "ItemList" ADD CONSTRAINT "ItemList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemListRow" ADD CONSTRAINT "ItemListRow_listId_fkey" FOREIGN KEY ("listId") REFERENCES "ItemList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
