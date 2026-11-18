import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  eyebrow?: string;
  description?: string;
  action?: ReactNode;
}

export default function PageHeader({ title, eyebrow, description, action }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="title">{title}</h1>
        {description ? <p className="page-header__description">{description}</p> : null}
      </div>
      {action}
    </header>
  );
}
