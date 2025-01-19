import clsx from "clsx";
import { forwardRef } from "react";

const Input = forwardRef((props, ref) => {
  const {
    error,
    register,
    name,
    type,
    placeholder,
    shouldValidateOnSubmit,
    isSubmitted,
    value,
  } = props;

  return (
    <div>
      <input
        ref={ref}
        className={clsx(
          "w-full rounded bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary",
          error && (!shouldValidateOnSubmit || isSubmitted)
            ? "border-[1.5px] border-red-500"
            : "border-[1.5px] border-stroke"
        )}
        placeholder={placeholder}
        value={value}
        {...(register
          ? register(name, {
              valueAsNumber: type === "number" ? true : false,
            })
          : {})}
        {...props}
      />
      {error && (!shouldValidateOnSubmit || isSubmitted) && (
        <div className="mt-1">
          <label className="label">
            <span className="break-words text-sm font-light text-red-500">
              {error}
            </span>
          </label>
        </div>
      )}
    </div>
  );
});

export { Input };
