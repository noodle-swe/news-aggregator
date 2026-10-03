import { FileQuestion } from 'lucide-react';
import { Link } from 'react-router';
import { buttonStyles } from '@/components/ui/buttonStyles';
import { EmptyState } from '@/components/ui/EmptyState';

export default function NotFoundPage() {
  return (
    <EmptyState
      icon={FileQuestion}
      title="Page not found"
      description="The page you’re looking for doesn’t exist or has moved."
      action={
        <Link to="/" className={buttonStyles()}>
          Back to your feed
        </Link>
      }
    />
  );
}
