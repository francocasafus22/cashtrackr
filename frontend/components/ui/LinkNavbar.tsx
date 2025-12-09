import Link from "next/link";

export default function LinkNavbar({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="font-bold text-white hover:text-amber-500 uppercase text-sm text-center"
    >
      {label}
    </Link>
  );
}
