"use client";

import { plans } from "@/lib/constants";
import { SealCheck } from "@phosphor-icons/react";

type Props = {};

function UpgradePage({}: Props) {
  return (
    <section className="bg-gray-100">
      <div className="wrapper flex items-center justify-center py-12 fles-col">
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`flex flex-col p-8  border shadow-xl rounded-3xl shadow-gray-500/10 lg:p-12 ${
                plan.title == "Pro" ? "bg-[#7303c0] text-white" : "bg-white"
              }`}
            >
              <div>
                <div className="flex justify-between">
                  <div className="flex gap-3">
                    <p className="text-4xl font-medium lg:text-3xl">
                      {plan.title}
                    </p>
                  </div>
                  <p>
                    <span className="text-2xl font-bold lg:text-3xl">
                      ${plan.subscriptionFeePerMonth}
                    </span>
                    <span className="text-base font-medium"> /mo</span>
                  </p>
                </div>
                <p className="mt-8 text-sm">{plan.description}</p>
              </div>
              <div className="order-last">
                <p className="mt-4 text-2xl font-medium lg:text-2xl lg:mt-8">
                  Features
                </p>
                <ul
                  className="order-last gap-4 mt-4 space-y-3 list-none"
                  role="list"
                >
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <SealCheck size={32} />
                      <span> {feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default UpgradePage;
