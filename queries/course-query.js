import { CategoryModel } from "@/models/category-model";
import { CourseModel } from "@/models/course-model";
import { ModuleModel } from "@/models/module-model";
import { TestimonialModel } from "@/models/testimonial-model";
import { UserModel } from "@/models/user-model";
import connectDB from "@/services/connectDB";

export async function getCoursesList() {
  try {
    await connectDB();
    const courses = await CourseModel.find({})
      .select([
        "title",
        "subtitle",
        "thumbnail",
        "modules",
        "price",
        "category",
        "instructor",
      ])
      .populate({
        path: "modules",
        model: ModuleModel,
      })
      .populate({
        path: "category",
        model: CategoryModel,
      })
      .populate({
        path: "instructor",
        model: UserModel,
      })
      .populate({
        path: "testimonials",
        model: TestimonialModel,
      })
      .lean();
    return courses;
  } catch (error) {
    throw error;
  }
}
