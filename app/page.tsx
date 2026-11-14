import { Footer } from "@/components/sections/footer";
import { HeroSection } from "@/components/sections/hero";
import { MyStackSection } from "@/components/sections/my-stack";
import { StackOrbitSection } from "@/components/sections/stack-orbit";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <HeroSection />
        <MyStackSection />
        <StackOrbitSection />
      </main>
      <Footer />
    </>
  );
}
