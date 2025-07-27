'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    ArrowLeft,
    ChevronRight,
    FileCheck,
} from "lucide-react" // ✅ static icon imports
import * as Icons from "lucide-react" // ✅ dynamic icon access

import { useState } from "react"


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
    onSectionSelect: (sectionId: string) => void
}


export default function SectionDescription({ card, sections, onSectionSelect }: Props) {
    const { questionEN, setQuestionsEN } = useState(0);

    const onSectionBTN = (section: SectionData) => {
        console.log("Selected Section:", section)
        onSectionSelect(section);
    }

    const onBack = () => {
        window.history.back()
    }

    const getGradientClass = (color: CardData["color"]): string => {
        if (!color?.shade || !color?.intensity)
            return "from-gray-400 to-gray-600"
        const nextIntensity = Math.min(color.intensity + 100, 600)
        const intensity = Math.max(color.intensity, 100)
        return `from-${color.shade}-${intensity} to-${color.shade}-${nextIntensity}`
    }

    const getSectionIcon = (iconName: string) => {
        const LucideIcon = Icons[iconName as keyof typeof Icons]
        return LucideIcon ? <LucideIcon className="h-6 w-6 text-gray-500" /> : null
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="flex items-center gap-2 hover:bg-gray-50 bg-transparent"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Categories
                </Button>
            </div>

            <div className="text-center">
                <div
                    className={`inline-block p-4 rounded-full bg-gradient-to-r ${getGradientClass(
                        card.color
                    )} mb-4`}
                >
                    <FileCheck className="h-12 w-12 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {card.title}
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                    {card.description}
                </p>
                <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {sections.length} sections to complete
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {sections.map((section, index) => (
                    <Card
                        key={section.id}
                        className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-0 shadow-md bg-white hover:bg-gray-50"
                        onClick={() => onSectionSelect(section)}
                    >
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`w-12 h-12 bg-gradient-to-r ${getGradientClass(
                                            card.color
                                        )} text-white rounded-xl flex items-center justify-center font-bold text-lg`}
                                    >
                                        {index + 1}
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-gray-900">
                                            {section.title}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 mt-1">
                                            {getSectionIcon(section.icon)}
                                            <span className="text-sm text-gray-500">
                                                {section.questionCount} questions
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <CardDescription className="text-gray-600 mb-4 text-base">
                                {section.description}
                            </CardDescription>
                            <Button
                                size="sm"
                                className={`bg-gradient-to-r ${getGradientClass(
                                    card.color
                                )} hover:opacity-90 text-white font-medium`}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onSectionBTN(section)
                                }}
                            >
                                Start Section
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
