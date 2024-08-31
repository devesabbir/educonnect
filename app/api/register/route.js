import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/services/connectDB";

import { UserModel } from "@/models/user-model";

export async function POST(request) {
  const { firstName, lastName, email, password, userRole } =
    await request.json();
  await connectDB();

  const hashedPassword = await bcrypt.hash(password, 5);

  const newUser = {
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: userRole,
  };

  try {
    await UserModel.create(newUser);
    return new NextResponse("User has been created", {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}
