import * as z from "zod";

export const SignupValidationSchema = z.object({
  name: z.string().min(2, { message: "Name too short" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const SigninValidationSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const ForgetPasswordValidationSchema = z.object({
  email: z.string().email(),
})

export const ResetPasswordValidationSchema = z.object({
  newPassword: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
});

export const CreateAssistantValidationSchema = z.object({
  alt_name: z.string().min(2, { message: "Name too short" }),
  description: z.string().min(10, { message: "description too short" }),
  alt_prompt: z.string(),
  model: z.string(),
  files: z.array(z.string()),
  is_selecting_files: z.boolean(),
  is_code_interpreter: z.boolean(),
});

export const EditAssistantValidationSchema = z.object({
  alt_name: z.string().min(2, { message: "Name too short" }),
  description: z.string().min(10, { message: "description too short" }),
  alt_prompt: z.string(),
  files: z.array(z.string()),
  is_selecting_files: z.boolean(),
  is_code_interpreter: z.boolean(),
});
