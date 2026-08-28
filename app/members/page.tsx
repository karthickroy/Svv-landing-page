import { MembersScreen } from "@/components/members/members-screen"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "SVV Group Members — Sree Veera Vigneshwar",
  description: "Meet the 50 group members, organizers, youth leaders and advisory committee of Sree Veera Vigneshwar.",
}

export default function MembersPage() {
  return <MembersScreen />
}
