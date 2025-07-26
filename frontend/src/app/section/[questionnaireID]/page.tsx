// app/section/[id]/page.tsx

import { notFound } from "next/navigation"
import SectionComponent from "./SectionComponent"
import { getQuestionById } from "@/lib/api/questions/questions"

interface Props {
  params: { id: string }
}

export default async function SectionPage({ params }: Props) {
  console.log("Prams: ", params);
  const card = await getQuestionById(params)

  if (!card) return notFound()

  return (
    <SectionComponent
      card={{
        id: card.questionnaireID,
        title: card.questionnaireTitle,
        description: card.questionnaireDescription.join(", "),
        color: `from-${card.color.shade}-${card.color.intensity} to-${card.color.shade}-${Math.min(
          card.color.intensity,
          600
        )}`,
      }}
      onSectionSelect={(section) => {
        console.log("Selected section:", section)
      }}
      onBack={() => {
        // This won't work in server-side component, you can use <Link> or have a client wrapper
      }}
    />
  )
}
