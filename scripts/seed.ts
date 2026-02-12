import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import fs from "node:fs";

function loadEnvFromFile(filePath: string) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const eqIndex = line.indexOf("=");
    if (eqIndex === -1) continue;

    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFromFile(".env.local");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please set MONGODB_URI environment variable");
  process.exit(1);
}

// Inline schemas to avoid import issues with tsx
const CourseSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    location: { type: String, required: true },
    spotsTotal: { type: Number, required: true },
    spotsRemaining: { type: Number, required: true },
    price: { type: Number, required: true },
    type: { type: String, enum: ["fixed", "flexible"], required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const AdminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const Course =
  mongoose.models.Course || mongoose.model("Course", CourseSchema);
const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI as string);
  console.log("Connected!\n");

  // Seed courses
  console.log("Seeding courses...");
  await Course.deleteMany({});

  const now = new Date();
  const courses = [
    {
      date: new Date(now.getFullYear(), now.getMonth() + 1, 18, 9, 0),
      location: "Rochford, Essex",
      spotsTotal: 8,
      spotsRemaining: 4,
      price: 65,
      type: "fixed",
      active: true,
    },
    {
      date: new Date(now.getFullYear(), now.getMonth() + 2, 5, 9, 0),
      location: "Rochford, Essex",
      spotsTotal: 8,
      spotsRemaining: 6,
      price: 65,
      type: "fixed",
      active: true,
    },
    {
      date: new Date(now.getFullYear(), now.getMonth() + 2, 19, 9, 0),
      location: "Rochford, Essex",
      spotsTotal: 8,
      spotsRemaining: 2,
      price: 65,
      type: "fixed",
      active: true,
    },
    {
      date: new Date(now.getFullYear(), now.getMonth() + 3, 2, 9, 0),
      location: "Rochford, Essex",
      spotsTotal: 8,
      spotsRemaining: 8,
      price: 65,
      type: "fixed",
      active: true,
    },
    {
      date: new Date(now.getFullYear(), now.getMonth() + 3, 23, 9, 0),
      location: "Rochford, Essex",
      spotsTotal: 8,
      spotsRemaining: 8,
      price: 65,
      type: "fixed",
      active: true,
    },
    {
      date: new Date(now.getFullYear(), now.getMonth() + 4, 1, 9, 0),
      location: "Rochford, Essex",
      spotsTotal: 99,
      spotsRemaining: 99,
      price: 75,
      type: "flexible",
      active: true,
    },
  ];

  await Course.insertMany(courses);
  console.log(`  Created ${courses.length} courses\n`);

  // Seed admin user
  console.log("Seeding admin user...");
  await Admin.deleteMany({});

  const tempPassword = "CabbieAdmin2026!";
  const hashedPassword = await bcrypt.hash(tempPassword, 12);

  await Admin.create({
    email: "info@cabbietraining.co.uk",
    password: hashedPassword,
    name: "Wendy Clarke",
  });

  console.log("  Admin user created:");
  console.log("  Email:    info@cabbietraining.co.uk");
  console.log(`  Password: ${tempPassword}`);
  console.log("  (Change this password after first login!)\n");

  console.log("Seed complete!");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
