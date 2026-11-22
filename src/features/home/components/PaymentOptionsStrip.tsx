import { CreditCard } from "lucide-react";
import { PAYMENT_METHODS, type PaymentMethod } from "@/config/payments";
import { cn } from "@/lib/cn";
import { useT } from "@/i18n/useT";

/** Each half repeats the list so the track overfills wide screens and loops seamlessly. */
const PER_HALF = [...PAYMENT_METHODS, ...PAYMENT_METHODS];

function Tile({ method }: { method: PaymentMethod }) {
  return (
    <li className="flex w-[100px] shrink-0 flex-col items-center gap-1.5 sm:w-[110px]">
      <span
        className="flex h-[50px] w-full items-center justify-center overflow-hidden rounded-xl px-3.5 py-3 ring-1 ring-cream-200 sm:h-[54px]"
        style={{ backgroundColor: method.tile ?? "#ffffff" }}
      >
        <img
          src={method.logo}
          alt=""
          draggable={false}
          loading="lazy"
          className="size-full object-contain select-none"
        />
      </span>
      <span className="text-[11px] font-medium text-taupe-600">{method.name}</span>
    </li>
  );
}

function Run({ hidden }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className={cn("flex shrink-0 gap-3 pe-3 sm:gap-4 sm:pe-4", hidden && "motion-reduce:hidden")}
    >
      {PER_HALF.map((method, i) => (
        <Tile key={`${method.id}-${i}`} method={method} />
      ))}
    </ul>
  );
}

/**
 * Accepted payment & instalment providers: a fixed label beside a
 * continuously scrolling row of equal-size logo cards with faded edges.
 */
export function PaymentOptionsStrip() {
  const { m, fmt } = useT();
  const names = PAYMENT_METHODS.map((method) => method.name).join(", ");
  return (
    <section
      aria-label={fmt(m.home.payments, { names })}
      className="w-full border-b border-cream-200 bg-cream-100"
    >
      <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:gap-0 sm:py-6">
        <div className="flex shrink-0 items-center justify-center gap-2.5 px-4 text-center sm:w-[260px] sm:ps-8 sm:justify-start sm:text-start sm:border-e sm:border-sand-300 sm:pe-6 lg:w-[290px] lg:ps-12">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-cocoa-900 ring-1 ring-cream-200">
            <CreditCard className="size-4" strokeWidth={2} />
          </span>
          <p className="text-[13px] leading-tight font-bold tracking-tight text-cocoa-900">
            {m.home.paymentsLine1}
            <br className="hidden sm:block" /> {m.home.paymentsLine2}
          </p>
        </div>

        <div
          aria-hidden
          dir="ltr"
          className="min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:overflow-x-auto sm:ps-6"
        >
          <div
            className="flex w-max animate-marquee motion-reduce:animate-none"
            style={{ animationDuration: "34s" }}
          >
            <Run />
            <Run hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
