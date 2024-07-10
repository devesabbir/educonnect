import { replaceMongoIdInArray } from "@/lib/convertData";
import { CategoryModel } from "@/models/category-model";

export async function getCategories() {
  const categories = await CategoryModel.find({}).lean();
  return replaceMongoIdInArray(categories);
}
