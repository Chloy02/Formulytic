"use client"

import { useState } from "react"
import QuestionComponent from "./QuestionComponent"
import SectionComponent from "../section/[questionnaireID]/SectionComponent"

export default function QuestionnairePage() {
  const [selectedCard, setSelectedCard] = useState<any | null>(null)

  const handleCardSelect = (card: any) => {
    setSelectedCard(card)
  }

  const handleBack = () => {
    setSelectedCard(null)
  }

  return (
    <div className="p-6">
      {selectedCard ? (
        <SectionComponent
          card={{
            id: selectedCard.questionnaireID,
            title: selectedCard.questionnaireTitle,
            description: selectedCard.questionnaireDescription.join(", "),
            color: `from-${selectedCard.color.shade}-${selectedCard.color.intensity} to-${selectedCard.color.shade}-${Math.min(
              selectedCard.color.intensity,
              600
            )}`,
          }}
          onSectionSelect={(section) => {
            console.log("Selected section:", section)
          }}
          onBack={handleBack}
        />
      ) : (
        <QuestionComponent onCardSelect={handleCardSelect} />
      )}
    </div>
  )
}
