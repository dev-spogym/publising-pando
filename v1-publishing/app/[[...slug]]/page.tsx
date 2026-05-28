import { notFound } from "next/navigation";
import { PrototypeApp } from "@/components/prototype-app";
import { screens } from "@/app/data/registry";

export function generateStaticParams() {
  return [{ slug: [] }, ...screens.map((screen) => ({ slug: screen.route.split("/").filter(Boolean) }))];
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  const route = `/${slug.join("/")}`.replace(/\/$/, "") || "/";
  const normalized = route === "/" ? "/login" : route;
  const screen = screens.find((item) => item.route === normalized);
  if (!screen) notFound();
  return <PrototypeApp initialRoute={normalized} />;
}
