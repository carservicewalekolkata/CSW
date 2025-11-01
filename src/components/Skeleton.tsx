import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
}

const Skeleton = ({ className }: SkeletonProps) => (
  <div className={clsx('animate-pulse rounded-md bg-slate-200/60', className)} />
);

export default Skeleton;

