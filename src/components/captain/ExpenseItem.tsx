import { FileText, Paperclip } from "lucide-react";
import { categoryLabel, prettyDate, type ExpenseView } from "@/lib/captain/core";
import { cn, formatINR } from "@/lib/utils";

const STATUS: Record<ExpenseView["status"], { label: string; className: string }> = {
  pending: { label: "Waiting for review", className: "bg-saffron/15 text-saffron" },
  approved: { label: "Approved", className: "bg-forest-light/15 text-forest-light" },
  rejected: { label: "Rejected", className: "bg-red-500/15 text-red-500" },
};

/** One expense claim with its bills. `children` is where action buttons go. */
export function ExpenseItem({ expense, children }: { expense: ExpenseView; children?: React.ReactNode }) {
  const s = STATUS[expense.status];
  const approvedDiffers =
    expense.status === "approved" && expense.approvedAmount !== null && expense.approvedAmount !== expense.amount;
  return (
    <li className="rounded-xl border border-foreground/10 bg-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium">{expense.description}</p>
          <p className="mt-0.5 text-xs opacity-60">
            {categoryLabel(expense.category)} · {prettyDate(expense.date)} · {expense.submittedByName}
          </p>
        </div>
        <div className="text-right">
          <p className="font-heading text-lg font-bold tabular-nums">{formatINR(expense.amount)}</p>
          <span className={cn("mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold", s.className)}>
            {s.label}
          </span>
        </div>
      </div>

      {approvedDiffers && (
        <p className="mt-2 text-xs text-forest-light">BTT approved {formatINR(expense.approvedAmount ?? 0)} of this claim.</p>
      )}
      {expense.adminNote && (
        <p className="mt-2 rounded-lg bg-foreground/5 px-3 py-2 text-xs">
          <span className="font-semibold">BTT note:</span> {expense.adminNote}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        {expense.billLinks.length === 0 ? (
          <span className="flex items-center gap-1 opacity-50">
            <Paperclip size={13} /> No bill attached
          </span>
        ) : (
          expense.billLinks.map((b, i) =>
            b.url ? (
              <a
                key={i}
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-full border border-foreground/15 px-3 py-1 font-medium hover:bg-foreground/5"
              >
                <FileText size={13} /> Bill {i + 1}
              </a>
            ) : (
              <span key={i} className="rounded-full border border-foreground/10 px-3 py-1 opacity-50">
                Bill {i + 1} unavailable
              </span>
            )
          )
        )}
      </div>
      {children && <div className="mt-3 border-t border-foreground/10 pt-3">{children}</div>}
    </li>
  );
}
