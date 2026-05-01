const ProductCardSkeleton = () => {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-white shadow-sm">
      <div className="aspect-square w-full animate-pulse bg-muted" />
      <div className="flex flex-1 flex-col p-4 space-y-3">
        <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="mt-auto pt-4 space-y-2">
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          <div className="h-9 w-full animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
