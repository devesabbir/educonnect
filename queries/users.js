import { replaceMongoIdInObject } from "@/lib/convertData";
import { UserModel } from "@/models/user-model";

export async function getUserByEmail(email) {
  const user = await UserModel.findOne({ email: email }).lean();
  return replaceMongoIdInObject(user);
}
