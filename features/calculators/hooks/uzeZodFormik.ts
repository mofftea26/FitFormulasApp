import { FormikConfig, FormikValues, useFormik } from "formik";
import { z } from "zod";

export function useZodFormik<
  Z extends z.ZodTypeAny,
  TValues extends FormikValues = z.infer<Z> & FormikValues
>(schema: Z, config: Omit<FormikConfig<TValues>, "validate">) {
  return useFormik<TValues>({
    validate: (values) => {
      const res = schema.safeParse(values);
      if (res.success) return {};
      const formErrors: Record<string, string> = {};
      res.error.issues.forEach((i) => {
        const path = i.path.join(".");
        formErrors[path] = i.message;
      });
      return formErrors;
    },
    validateOnBlur: true,
    validateOnChange: false,
    ...config,
  });
}
