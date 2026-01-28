import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ icon: Icon = Inbox, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
        <Icon className="w-10 h-10 text-muted-foreground" />
      </div>
      <div className="text-center max-w-sm">
        <h3 className="font-semibold text-lg text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
