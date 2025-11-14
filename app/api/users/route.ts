import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME || "hive-3d");
    const users = await db
      .collection("users")
      .find({}, { projection: { password: 0 } })
      .toArray();

    const formattedUsers = users.map((u) => ({
      id: u._id.toString(),
      userId: u.userId,
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      avatar: u.avatar || null,
      isVerified: u.isVerified,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));

    return NextResponse.json(formattedUsers);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
