import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import { authSchema } from "@/utils/api/auth/schema";
import { useToken } from "@/utils/context/TokenContext";
import { login } from "@/utils/api/auth/api";
import { Input } from "@/components/forms/input";
import Bakso from "@/assets/images/Bakso.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [showIcon, setShowIcon] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { saveTokenAndUser } = useToken();

  const savedEmail = localStorage.getItem("savedEmail") || "";
  const savedPassword = localStorage.getItem("savedPassword") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: savedEmail,
      password: savedPassword,
    },
  });

  useEffect(() => {
    if (savedEmail && savedPassword) {
      setRememberMe(true);
      setValue("email", savedEmail);
      setValue("password", savedPassword);
    }
  }, [savedEmail, savedPassword, setValue]);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
    setShowIcon(!showIcon);
  };

  const onSubmit = async (data) => {
    try {
      const result = await login(data.email, data.password);

      if (rememberMe) {
        localStorage.setItem("accessToken", result.token);
        localStorage.setItem("savedEmail", data.email);
        localStorage.setItem("savedPassword", data.password);
      } else {
        sessionStorage.setItem("accessToken", result.token);
        localStorage.removeItem("savedEmail");
        localStorage.removeItem("savedPassword");
      }

      saveTokenAndUser(result.token);
      navigate("/dashboard");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Periksa akun anda kembali",
        text: error.message,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-[90%] md:max-w-[900px]">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="relative w-full h-full overflow-hidden">
              <img
                src={Bakso}
                alt="Mangkok Bakso"
                className="inset-0 max-w-none w-[700px] h-[605px]"
              />
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2">
            <div className="w-full p-4 sm:p-12.5 xl:p-13.5">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sistem Inventory Bakso Lik Tono
              </h2>
              <p className="dark:text-white mb-2.5 font-medium text-lg">
                Silahkan masukan email dan password
              </p>

              <form onSubmit={handleSubmit(onSubmit)}>
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Email
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Masukan email anda"
                    error={errors.email?.message}
                    register={register}
                  />
                </div>

                <div className="mb-6">
                  <label className="mt-4 mb-2.5 block font-medium text-black dark:text-white">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukan kata sandi anda"
                      error={errors.password?.message}
                      register={register}
                    />
                    {showIcon ? (
                      <IoEyeOutline
                        id="EyeIcon"
                        onClick={handleShowPassword}
                        className="w-5 h-5 absolute right-4 top-3.5 cursor-pointer"
                      />
                    ) : (
                      <IoEyeOffOutline
                        id="EyeOffIcon"
                        onClick={handleShowPassword}
                        className="w-5 h-5 absolute right-4 top-3.5 cursor-pointer"
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center mb-5">
                  <Input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-2"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-sm font-medium text-black dark:text-white"
                  >
                    Ingat saya
                  </label>
                </div>

                <div className="mb-5">
                  <button
                    type="submit"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  >
                    Masuk
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
