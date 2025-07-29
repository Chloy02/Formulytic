"use client"

import { useState } from "react"
import QuestionComponent from "./QuestionComponent"

interface CardData {
  questionnaireID: string;
  questionnaireTitle: string;
  questionnaireDescription: string[];
  color: {
    shade: string;
    intensity: number;
  };
}

interface SectionData {
  id: string;
  title: string;
  description: string;
}

// Simple fallback component
const SectionComponent = ({ 
  card, 
  onSectionSelect, 
  onBack 
}: { 
  card: { id: string; title: string; description: string; color: string }; 
  onSectionSelect: (section: SectionData) => void; 
  onBack: () => void; 
}) => (
  <div className="p-4">
    <button onClick={onBack} className="mb-4 px-4 py-2 bg-gray-500 text-white rounded">
      Back
    </button>
    <h2 className="text-2xl font-bold mb-4">{card.title}</h2>
    <p className="text-gray-600">{card.description}</p>
  </div>
);

export default function QuestionnairePage() {
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null)

  const handleCardSelect = (card: CardData) => {
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
          onSectionSelect={(section: SectionData) => {
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
