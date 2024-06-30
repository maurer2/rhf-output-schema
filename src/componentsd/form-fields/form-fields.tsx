import { useForm, SubmitHandler, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import { DevTool } from "@hookform/devtools";
import { useState } from "react";

export const formSchema = z.object({
  name: z.string().transform((value) => value.split(" ")),
  age: z.string().pipe(z.coerce.number()),
  isActive: z.boolean().transform((value) => (value ? "Yay" : "Nay")),
});

type FormSchema = z.input<typeof formSchema>;
type FormSchemaTransformed = z.output<typeof formSchema>;

export default function FormFields() {
  const [transformedValues, setTransformedValues] =
    useState<FormSchemaTransformed | null>(null);
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
        name="test form"
        aria-label="test form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <label htmlFor="name">Name</label>
          <input {...register("name")} id="name" />
          <ErrorMessage errors={errors} name="name" />
        </div>

        <div>
          <label htmlFor="age">Age</label>
          <input {...register("age")} id="age" />
          <ErrorMessage errors={errors} name="age" />
        </div>

        <div>
          <Controller
            control={control}
            name="isActive"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <div>
                  <input
                    type="checkbox"
                    onChange={(event) => {
                      onChange(event.currentTarget.checked);
                    }}
                    onBlur={onBlur}
                    name="isActive"
                    value="true"
                    id="is-active"
                    checked={value}
                  />
                  <label htmlFor="is-active">is active</label>
                </div>
                <ErrorMessage errors={errors} name="isActive" />
              </>
            )}
          />
        </div>

        <button type="submit">Send</button>

        <div>
          {transformedValues ? (
            <output>{JSON.stringify(transformedValues, null, 4)}</output>
          ) : null}
        </div>
      </form>
      <DevTool control={control} />
    </>
  );
}
