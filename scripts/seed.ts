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

const CouncilSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    note: { type: String },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Course =
  mongoose.models.Course || mongoose.model("Course", CourseSchema);
const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
const Council =
  mongoose.models.Council || mongoose.model("Council", CouncilSchema);

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

  // Seed councils
  console.log("Seeding councils...");
  await Council.deleteMany({});

  const councils = [
    { name: "Southend-on-Sea", displayName: "Southend-on-Sea City Council", order: 1 },
    { name: "Castle Point", displayName: "Castle Point Borough Council", order: 2 },
    { name: "Rochford", displayName: "Rochford District Council", order: 3 },
    { name: "Basildon", displayName: "Basildon Borough Council", order: 4 },
    { name: "Manchester", displayName: "Manchester City Council", order: 5 },
    { name: "Leeds", displayName: "Leeds City Council", order: 6 },
    { name: "Wigan", displayName: "Wigan Council", order: 7 },
    { name: "Sheffield", displayName: "Sheffield City Council", order: 8 },
    { name: "Rotherham", displayName: "Rotherham Metropolitan Borough Council", order: 9 },
    { name: "Hounslow", displayName: "London Borough of Hounslow", order: 10 },
    { name: "Calderdale", displayName: "Calderdale Council", order: 11 },
    { name: "Derbyshire", displayName: "Derbyshire County Council", order: 12 },
    { name: "North Lincolnshire", displayName: "North Lincolnshire Council", order: 13 },
    { name: "Sefton", displayName: "Sefton Council", order: 14 },
  ];

  await Council.insertMany(councils);
  console.log(`  Created ${councils.length} councils\n`);

  console.log("Seed complete!");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
