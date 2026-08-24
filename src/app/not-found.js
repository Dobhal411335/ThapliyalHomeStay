import { EmptyState } from "@/components/common/EmptyState";

export default function NotFound() {
  return (
    <EmptyState
      title="Page not found"
      description="The page you are looking for is not available."
      actionLabel="Return home"
      actionHref="/"
    />
  );
}
