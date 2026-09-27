import { redirect } from "next/navigation";

// The dashboard is the public landing page (it has an anonymous preview).
export default function Home() {
  redirect("/dashboard");
}
