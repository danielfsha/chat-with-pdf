import React from "react";

type Feature = {
    title: string;
    descriptions: Array<string>;
    icon: string;
};

type Pricing = {
    title: string;
    description: string;
    features: Array<string>,
    subscriptionFeePerMonth: number;
}

export type { Feature, Pricing };
