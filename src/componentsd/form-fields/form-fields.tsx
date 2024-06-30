import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import { DevTool } from "@hookform/devtools";
import { useState } from "react";

export const formSchema = z.object({
  name: z
    .string()
    .min(1)
    .transform((value) => value.split(" ")),
  age: z.string().min(1).pipe(z.coerce.number()),
  isActive: z.boolean().transform((value) => (value ? "Yay" : "Nay")),
});

type FormSchema = z.input<typeof formSchema>;
type FormSchemaTransformed = z.output<typeof formSchema>;

export default function FormFields() {
  const [transformedValues, setTransformedValues] = useState<FormSchemaTransformed | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormSchema, undefined, FormSchemaTransformed>({
    defaultValues: {
      name: "Name1 Name2",
      age: "50",
      isActive: true,
    },
    resolver: zodResolver(formSchema),
  }); // https://github.com/react-hook-form/react-hook-form/issues/12050

  const onSubmit: SubmitHandler<FormSchemaTransformed> = (data) => {
    console.log(data);

    setTransformedValues(data);
  };

  return (
    <>
      <form
        className="form"
        name="test form"
        aria-label="test form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="field">
          <label htmlFor="name">Name</label>
          <input {...register("name")} id="name" />
          <ErrorMessage errors={errors} name="name" />
        </div>

        <div className="field">
          <label htmlFor="age">Age</label>
          <input {...register("age")} id="age" />
          <ErrorMessage errors={errors} name="age" />
        </div>

        <div className="field-checkbox">
          <input type="checkbox" {...register("isActive")} id="isActive" />
          <label htmlFor="isActive">is active</label>
          <div className="error">
            <ErrorMessage errors={errors} name="isActive" />
          </div>
        </div>

        <button type="submit">Send</button>

        <div className="output">
          {transformedValues ? <output>{JSON.stringify(transformedValues, null, 4)}</output> : null}
        </div>
      </form>
      <DevTool control={control} />
    </>
  );
}
