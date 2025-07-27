"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation" // ✅ Required
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import * as Icons from "lucide-react"
import { getQuestionHome } from "../../lib/api/questions/questions"

interface CardData {
  questionnaireID: string
  questionnaireTitle: string
  questionnaireDescription: string[]
  sections: Record<string, number>
  color: {
    shade: string
    intensity: number
  }
  icon: string
}

export default function QuestionComponent() {
  const [cards, setCards] = useState<CardData[]>([])
  const router = useRouter() // ✅ Now `router` is available

  useEffect(() => {
    const fetchQuestions = async () => {
      const data = await getQuestionHome()
      console.log(data);
      setCards(data)
    }
    fetchQuestions()
  }, [])

  // ✅ Moved here so it can access `router`
  const handleStartSurvey = (card: CardData) => {
    router.push(`/section/${card.questionnaireID}`)
  }

  const getGradientClass = (color: CardData["color"]): string => {
    if (!color?.shade || !color?.intensity) return "from-gray-400 to-gray-600"
    const nextIntensity = Math.min(color.intensity, 600)
    const intensity = Math.max(color.intensity, 100)
    return `from-${color.shade}-${intensity} to-${color.shade}-${nextIntensity}`
  }

  const getIconComponent = (iconName: string) => {
    const LucideIcon = Icons[iconName as keyof typeof Icons]
    return LucideIcon ? <LucideIcon className="h-12 w-12 text-white" /> : null
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Formulytic</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Choose a survey category to begin collecting valuable insights and feedback from your audience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card) => (
          <Card
            key={card.questionnaireID}
            className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-0 shadow-lg overflow-hidden"
            onClick={() => handleStartSurvey(card)}
          >
            <div className={`h-32 bg-gradient-to-r ${getGradientClass(card.color)} flex items-center justify-center`}>
              {getIconComponent(card.icon)}
            </div>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-gray-900">
                {card.questionnaireTitle}
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                {card.questionnaireDescription.join(", ")}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-6">
              <div className="text-center space-y-4">
                <div className="text-sm text-gray-500 font-medium">
                  {Object.keys(card.sections).length} sections • Multiple question types
                </div>
                <Button
                  className={`w-full bg-gradient-to-r ${getGradientClass(card.color)} hover:opacity-90 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleStartSurvey(card) // ✅ This now works
                  }}
                >
                  Start Survey
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
