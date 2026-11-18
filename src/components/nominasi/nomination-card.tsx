import Image from "next/image";
import Link from "next/link";
import type { NominationItem } from "@/types/nominations";

export function NominationCard({ item }: { item: NominationItem }) {
  return (
    <Link href={`/nominasi/${item.id}`} className="group block bg-putih">
      <div className="h-60 overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          width={360}
          height={240}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-3 flex items-center justify-center bg-plum px-4 py-3 text-center text-sm font-semibold text-putih">
        {item.title}
      </div>
    </Link>
  );
}
