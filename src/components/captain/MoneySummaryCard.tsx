import { balanceMessage, type MoneySummary } from "@/lib/captain/core";
import { cn, formatINR } from "@/lib/utils";

/** The tally: money given, claimed, approved, and who owes whom. */
export function MoneySummaryCard({ money, showPendingHint = true }: { money: MoneySummary; showPendingHint?: boolean }) {
  const msg = balanceMessage(money.outstanding, formatINR);
  const rows: [string, number, string?][] = [
    ["Advance given by BTT", money.totalAdvance],
    ["Claimed by captain", money.claimed],
    ["Approved by BTT", money.approved, "text-forest-light"],
    ["Waiting for review", money.pending, money.pending > 0 ? "text-saffron" : undefined],
    ["Rejected", money.rejected, money.rejected > 0 ? "text-red-500" : undefined],
    ["Cash returned to BTT", money.returned],
    ["Paid to captain by BTT", money.paidOut],
  ];
  return (
    <div className="rounded-2xl border border-foreground/10 bg-surface p-5">
      <dl className="grid grid-cols-1 gap-x-8 gap-y-2.5 text-sm sm:grid-cols-2">
        {rows.map(([label, value, tone]) => (
          <div key={label} className="flex items-baseline justify-between gap-3 border-b border-foreground/5 pb-2">
            <dt className="opacity-70">{label}</dt>
            <dd className={cn("font-semibold tabular-nums", tone)}>{formatINR(value)}</dd>
          </div>
        ))}
      </dl>
      <div
        className={cn(
          "mt-4 rounded-xl p-4 text-sm font-semibold",
          msg.tone === "ok" && "bg-forest-light/10 text-forest-light",
          msg.tone === "owes" && "bg-saffron/10 text-saffron",
          msg.tone === "due" && "bg-royal/10 text-royal-light"
        )}
      >
        {msg.text}
        {showPendingHint && money.pending > 0 && (
          <p className="mt-1 text-xs font-normal opacity-80">
            {formatINR(money.pending)} is still waiting for review. If all of it is approved, the result would be:{" "}
            {balanceMessage(money.outstandingIfAllApproved, formatINR).text}
          </p>
        )}
      </div>
    </div>
  );
}
