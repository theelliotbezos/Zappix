import Link from "next/link";

interface LogoProps {
  className?: string;
  linkTo?: string;
}

export function Logo({ className = "", linkTo = "/" }: LogoProps) {
  return (
    <Link href={linkTo} className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
        <span className="text-lg font-bold text-white">Z</span>
      </div>
      <span className="text-xl font-bold text-gray-900">Zappix</span>
    </Link>
  );
}
