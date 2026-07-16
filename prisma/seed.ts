import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Default system settings
  const settings = await prisma.systemSetting.findFirst();

  if (!settings) {
    await prisma.systemSetting.create({
      data: {
        parkingName: "SmartPark UG",
        gracePeriod: 15,
      },
    });

    console.log("✅ System settings created");
  }

  // Default admin user
  const admin = await prisma.user.findUnique({
    where: {
      email: "admin@smartpark.com",
    },
  });

  if (!admin) {
    const password = await bcrypt.hash("admin123", 10);

    await prisma.user.create({
      data: {
        fullName: "System Administrator",
        email: "admin@smartpark.com",
        password,
        role: "ADMIN",
      },
    });

    console.log("✅ Admin user created");
  } else {
    console.log("ℹ️ Admin already exists");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });