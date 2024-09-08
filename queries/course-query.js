import { replaceMongoIdInObject } from "@/lib/convertData";
import { CategoryModel } from "@/models/category-model";
import { CourseModel } from "@/models/course-model";
import { ModuleModel } from "@/models/module-model";

import { UserModel } from "@/models/user-model";
import connectDB from "@/services/connectDB";
import { getEnrollmentsForCourse } from "./enrollments";
import { getTestimonialsForCourse } from "./testimonials";
import { Testimonial as TestimonialModel } from "@/models/testimonial-model";

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

export async function getCourseDetails(id) {
  try {
    await connectDB();
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
        model: TestimonialModel,
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
  } catch (error) {
    throw error;
  }
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
