const LoadingIndicator = () => (
  <div className="flex items-center justify-center py-10">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0285CE] border-t-transparent" aria-hidden />
    <span className="sr-only">Loading</span>
  </div>
);

export default LoadingIndicator;
