import { Feature } from "./types";

export const features: Feature[] = [
    {
        title: "Ask & Understand",
        descriptions: [
            'Questions about your PDF content.',
            'Grasp the context and intent of your queries.',
            'Handle complex questions.'
        ],
        icon: "Folder",
    },
    {
        title: "Summarize & Analyze",
        descriptions: [
            'Summarize the key points and extract relevant information.',
            'Analyze the sentiment and tone of the content.',
            'Extract named entities and relationships.'
        ],
        icon: "PresentationChart",
    },
    {
        title: "Find & Extract",
        descriptions: [
            'Locate specific information or data points.',
            'Extract data from tables, charts, and other visual elements.',
            'Handle complex data structures and extract data.'
        ],
        icon: "MagnifyingGlass",
    },
    {
        title: 'Navigate & Explore',
        descriptions: [
            'Navigate through the PDF to find specific information.',
            'Explore the PDF to gain a deeper understanding.',
            'Handle complex data structures.'
        ],
        icon: "Compass",
    }
];