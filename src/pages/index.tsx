import { Inter } from "next/font/google";
import Interface from "../components/Interface";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Interface />
        </div>
      </div>
    </main>
  );
}
