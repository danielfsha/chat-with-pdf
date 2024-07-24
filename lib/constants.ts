import { Feature, Pricing } from "./types";

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


export const plans: Pricing[] = [
    {
        title: "Free",
        description: "If you are just getting started, this plan is ideal for you. It offers a balance of essential features and is perfect for personal needs without any limitations.",
        features: [
            '10 documents',
            '5MB Max File size',
            'Basic analytics and reporting',
            'email support',
        ],
        subscriptionFeePerMonth: 0
    },{
        title: 'Pro',
        description: 'If you are looking for more advanced features and support, this plan is the right choice for you.',
        features: [
            'Unlimited documents',
            'Unlimited File size',
            'Custom domain support',
            'Advanced analytics and reporting',
            '24/7 support',
            'Priority customer support',
            'Access to our private beta',
        ],
        subscriptionFeePerMonth: 6.99
    }
]