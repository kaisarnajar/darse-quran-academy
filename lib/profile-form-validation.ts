import { zodResultToFormValidation, type FormValidationResult } from "@/lib/form-validation";
import { studentReviewSchema } from "@/lib/validations";

export type StudentReviewFormValues = {
  quote: string;
  course: string;
  location: string;
  rating: number;
};

export function validateStudentReviewForm(values: StudentReviewFormValues): FormValidationResult {
  return zodResultToFormValidation(
    studentReviewSchema.safeParse({
      quote: values.quote,
      course: values.course,
      location: values.location,
      rating: values.rating > 0 ? values.rating : "",
    }),
  );
}
