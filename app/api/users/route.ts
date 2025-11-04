import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("clo-3d");
    const users = await db
      .collection("users")
      .find({}, { projection: { password: 0 } }) // wag isama password
      .toArray();

    // map _id to id para sa frontend
    const formattedUsers = users.map((u) => ({
      id: u._id.toString(),
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      avatar: u.avatar || null,
      createdAt: u.createdAt
    }));

    return NextResponse.json(formattedUsers);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
