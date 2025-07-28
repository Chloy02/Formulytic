// app/section/[questionnaireID]/page.tsx

import { notFound } from "next/navigation"
import SectionView from "./SectionView"
import { getQuestionById } from "@/lib/api/questions/questions"

interface Props {
  params: Promise<{ questionnaireID: string }>
}

export default async function SectionPage({ params }: Props) {
  const { questionnaireID } = await params
  const idAsNumber = Number(questionnaireID)
  if (isNaN(idAsNumber)) return notFound()

  const card = await getQuestionById(idAsNumber)
  if (!card) return notFound()

  // TODO: Replace with real sections
  const sections = card;

  return <SectionView card={card} sections={sections} />
}
