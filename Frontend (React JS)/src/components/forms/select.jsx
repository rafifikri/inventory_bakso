import clsx from "clsx";
import { forwardRef } from "react";
import { GiNoodles } from "react-icons/gi";
import { IoIosArrowDown } from "react-icons/io";

const Select = forwardRef((props, ref) => {
  const {
    placeholder,
    error,
    options,
    register,
    name,
    onChange,
    shouldValidateOnSubmit,
    isSubmitted,
  } = props;

  return (
    <div>
      <div className="relative">
        <span className="absolute top-1/2 left-3 transform -translate-y-1/2 z-20">
          <GiNoodles className="size-6" />
        </span>
        <select
          ref={ref}
          className={clsx(
            "w-full appearance-none rounded bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
            error && (!shouldValidateOnSubmit || isSubmitted)
              ? "border-[1.5px] border-red-500"
              : "border-[1.5px] border-stroke"
          )}
          defaultValue=""
          {...(register
            ? register(name, {
                onChange,
              })
            : {})}
        >
          <option disabled value="">
            {placeholder}
          </option>
          {options.map((option, idx) => (
            <option key={idx} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="absolute top-1/2 right-3 transform -translate-y-1/2 z-10">
          <IoIosArrowDown className="size-6" />
        </span>
      </div>
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

export { Select };
