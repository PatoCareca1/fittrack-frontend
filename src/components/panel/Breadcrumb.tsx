import Link from "next/link";
import { ChevronRightIcon } from "@/components/ui/icons";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-text-secondary">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-text-primary">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-text-primary" : ""}>{item.label}</span>
            )}
            {!isLast && <ChevronRightIcon width={14} height={14} />}
          </span>
        );
      })}
    </nav>
  );
}
