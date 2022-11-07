import Link from "next/link";
import { ReactNode } from "react";

export default function WithNavbarPageWrapper(props: { children: ReactNode }) {
  const { children } = props;

  return (
    <div className="w-screen h-auto min-h-screen flex flex-col bg-hanastone">
      <div className="flex flex-row w-full h-16 bg-hanagreen px-4 items-center justify-between text-hanastone">
        <p className="text-xl font-bold">Climatix App</p>
        <Link href="https://hanaloop.com/">
          <p className="cursor-pointer">
            Powered by <span className="font-bold">HanaLoop</span>
          </p>
        </Link>
      </div>
      <div className="w-full flex flex-col container mx-auto min-h-screen bg-hanastone px-6">
        {children}
      </div>
    </div>
  );
}
