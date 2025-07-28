'use client'

import { useState } from "react"
import SectionDescription from "./SectionDescription"
import QuestionForm from "./Questions"

interface CardData {
  id: string
  title: string
  description: string
  color: {
    shade: string
    intensity: number
  }
}

interface Question {
  questionID: string
  question: string
  questionType: string
  options: string[]
}

interface SectionData {
  id: string
  title: string
  description: string
  icon: string
  questionCount: number
  questions: Question[]
}

interface Props {
  card: CardData
  sections: SectionData[]
}

export default function SectionView({ card, sections }: Props) {
  const [selectedSection, setSelectedSection] = useState<SectionData | null>(null)

  const handleSectionSelect = (section: SectionData) => {
    console.log("Selected Section: ", section)
    setSelectedSection(section)
  }

  if (selectedSection) {
    return <QuestionForm id={selectedSection.id} title={selectedSection.title} question={selectedSection.questions} />
  }

  return (
    <SectionDescription
      card={card}
      sections={sections}
      onSectionSelect={handleSectionSelect}
    />
  )
}
