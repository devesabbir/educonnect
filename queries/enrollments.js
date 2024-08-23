import { replaceMongoIdInArray } from "@/lib/convertData";
import { Enrollment } from "@/models/enrollment-model";

export async function getEnrollmentsForCourse(courseId) {
  const enrollments = await Enrollment.find({ course: courseId }).lean();
  return replaceMongoIdInArray(enrollments);
}
