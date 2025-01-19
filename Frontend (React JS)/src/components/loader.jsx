export const Loader = ({ fullScreen = false, className = "" }) => {
  return (
    <div
      className={`flex items-center justify-center dark:bg-boxdark ${
        fullScreen ? "h-screen" : "h-auto"
      } bg-transparent ${className}`}
    >
      <div
        className={`h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent`}
      ></div>
    </div>
  );
};
