import {
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from "@/lib/convertData";
import { CourseModel } from "@/models/course-model";
import { getEnrollmentsForCourse } from "./enrollments";
import { getTestimonialsForCourse } from "./testimonials";
import { CategoryModel } from "@/models/category-model";
import { UserModel } from "@/models/user-model";
import { Testimonial } from "@/models/testimonial-model";
import { ModuleModel } from "@/models/module-model";
import { connectDB } from "@/services/connectDB";

export async function getCourseList() {
  const courses = await CourseModel.find()
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
      path: "category",
      model: CategoryModel,
    })
    .populate({
      path: "instructor",
      model: UserModel,
    })
    .populate({
      path: "testimonials",
      model: Testimonial,
    })
    .populate({
      path: "modules",
      model: ModuleModel,
    })
    .lean();
  return replaceMongoIdInArray(courses);
}

export async function getCourseDetails(id) {
  const course = await CourseModel.findById(id)
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
      model: Testimonial,
      populate: {
        path: "user",
        model: UserModel,
      },
    })
    .populate({
      path: "modules",
      model: ModuleModel,
    })
    .lean();

  return replaceMongoIdInObject(course);
}

export async function getCourseDetailsByInstructor(instructorId) {
  const courses = await CourseModel.find({ instructor: instructorId }).lean();

  const enrollments = await Promise.all(
    courses.map(async (course) => {
      const enrollment = await getEnrollmentsForCourse(course._id.toString());
      return enrollment;
    })
  );

  const totalEnrollments = enrollments.reduce(function (acc, obj) {
    return acc + obj.length;
  }, 0);

  const testimonials = await Promise.all(
    courses.map(async (course) => {
      const testimonial = await getTestimonialsForCourse(course._id.toString());
      return testimonial;
    })
  );

  const totalTestimonials = testimonials.flat();
  const avgRating =
    totalTestimonials.reduce(function (acc, obj) {
      return acc + obj.rating;
    }, 0) / totalTestimonials.length;

  //console.log("testimonials", totalTestimonials, avgRating);

  return {
    courses: courses.length,
    enrollments: totalEnrollments,
    reviews: totalTestimonials.length,
    ratings: avgRating.toPrecision(2),
  };
}
