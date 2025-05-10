// // ✅ Step 1: Add environment check to prevent accidental seeding
if (process.env.NODE_ENV !== "development") {
  console.log("⚠️ Seeding skipped: Not in development mode");
  process.exit(0); // Stop the script
}

// ✅ Step 2: Existing imports
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// ✅ Step 3: Create Prisma client
const prisma = new PrismaClient();

// ✅ Step 4: Function to delete all existing data in each table
async function deleteAllData(orderedFileNames: string[]) {
  const modelNames = orderedFileNames.map((fileName) => {
    const modelName = path.basename(fileName, path.extname(fileName));
    return modelName.charAt(0).toUpperCase() + modelName.slice(1);
  });

  for (const modelName of modelNames) {
    const model: any = prisma[modelName as keyof typeof prisma];
    try {
      await model.deleteMany({});
      console.log(`🧹 Cleared data from ${modelName}`);
    } catch (error) {
      console.error(`❌ Error clearing data from ${modelName}:`, error);
    }
  }
}

// ✅ Step 5: Main seeding logic
async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  // Define the order to delete and re-insert records (foreign key safety)
  const orderedFileNames = [
    "team.json",
    "project.json",
    "projectTeam.json",
    "user.json",
    "task.json",
    "attachment.json",
    "comment.json",
    "taskAssignment.json",
  ];

  // 🧹 Delete existing data first
  await deleteAllData(orderedFileNames);

  // 📥 Seed data from each JSON file
  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));
    const model: any = prisma[modelName as keyof typeof prisma];

    try {
      for (const data of jsonData) {
        await model.create({ data });
      }
      console.log(`🌱 Seeded ${modelName} with data from ${fileName}`);
    } catch (error) {
      console.error(`❌ Error seeding data for ${modelName}:`, error);
    }
  }
}

// ✅ Step 6: Run seeding and close the connection
main()
  .catch((e) => console.error("💥 Seeding failed:", e))
  .finally(async () => await prisma.$disconnect());
