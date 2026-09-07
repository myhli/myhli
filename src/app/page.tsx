import { redirect } from "next/navigation";
import { home, baseURL } from "@/resources";
import { Meta } from "@once-ui-system/core";

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

export default function Home() {
  redirect("/about");
}
