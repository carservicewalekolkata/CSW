type ProgressIndicatorProps = {
  progress: number;
};

const ProgressIndicator = ({ progress }: ProgressIndicatorProps) => {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-cyan-100/90" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-2 origin-left bg-gradient-to-r from-sky-400 via-cyan-500 to-sky-600 transition-transform duration-200 ease-out"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden
      />
    </>
  );
};

export default ProgressIndicator;
