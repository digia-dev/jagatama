import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: string;
  onAction?: () => void;
  icon?: string;
};

const EmptyState = ({ title, description, action, onAction, icon = "🌱" }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-reveal">
      <div className="text-6xl mb-4 select-none" aria-hidden>
        {icon}
      </div>
      <h3 className="font-heading text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm mt-1 max-w-[250px] mx-auto leading-relaxed">
        {description}
      </p>
      {action && onAction && (
        <Button onClick={onAction} className="mt-6 bg-harvest hover:bg-harvest/90 text-white rounded-full px-8">
          {action}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
