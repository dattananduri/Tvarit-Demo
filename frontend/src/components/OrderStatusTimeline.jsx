import React from 'react';
import {
  FileText,
  UserCheck,
  ShoppingBag,
  PackageCheck,
  Bike,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const STEPS = [
  {
    key: 'CREATED',
    label: 'Order Placed',
    description: 'Looking for nearby partner',
    icon: FileText,
  },
  {
    key: 'ACCEPTED',
    label: 'Partner Accepted',
    description: 'Partner heading to local shop',
    icon: UserCheck,
  },
  {
    key: 'SHOPPING',
    label: 'Shopping Locally',
    description: 'Partner buying items from store',
    icon: ShoppingBag,
  },
  {
    key: 'PICKED_UP',
    label: 'Items Picked Up',
    description: 'Billed & packed ready to ride',
    icon: PackageCheck,
  },
  {
    key: 'OUT_FOR_DELIVERY',
    label: 'Out for Delivery',
    description: 'Partner en route to your address',
    icon: Bike,
  },
  {
    key: 'DELIVERED',
    label: 'Delivered',
    description: 'Order handed over safely',
    icon: CheckCircle2,
  },
];

export const OrderStatusTimeline = ({ status }) => {
  if (status === 'CANCELLED') {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-center my-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-2">
          <XCircle className="w-7 h-7" />
        </div>
        <h4 className="text-base font-bold text-rose-900">Order Cancelled</h4>
        <p className="text-xs text-rose-700 mt-1">This order request was cancelled and is no longer active.</p>
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex((s) => s.key === status);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-[#102A24]">Live Delivery Timeline</h3>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#00B373] border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-[#00B373] animate-pulse"></span>
          {STEPS[activeIndex]?.label || status}
        </span>
      </div>

      {/* Desktop Horizontal Timeline */}
      <div className="hidden md:block">
        <div className="relative flex items-center justify-between">
          {/* Connecting Track Line */}
          <div className="absolute left-6 right-6 top-6 -translate-y-1/2 h-1 bg-slate-100 -z-0">
            <div
              className="h-full bg-[#00B373] transition-all duration-700 ease-out"
              style={{
                width: `${(activeIndex / (STEPS.length - 1)) * 100}%`,
              }}
            ></div>
          </div>

          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            const isPending = idx > activeIndex;

            return (
              <div key={step.key} className="flex flex-col items-center text-center relative z-10 w-24">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'bg-[#00B373] text-white shadow-md shadow-emerald-500/20'
                      : isCurrent
                      ? 'bg-[#102A24] text-white ring-4 ring-emerald-300 ring-offset-2 scale-110 shadow-lg'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <p
                  className={`text-xs font-bold mt-2.5 leading-tight ${
                    isCurrent ? 'text-[#00B373]' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight hidden lg:block">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Vertical Timeline */}
      <div className="md:hidden space-y-4">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx < activeIndex;
          const isCurrent = idx === activeIndex;
          const isPending = idx > activeIndex;

          return (
            <div key={step.key} className="flex items-start gap-3 relative">
              {idx < STEPS.length - 1 && (
                <div
                  className={`absolute left-5 top-10 bottom-0 w-0.5 -ml-[1px] ${
                    isCompleted ? 'bg-[#00B373]' : 'bg-slate-200'
                  }`}
                />
              )}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  isCompleted
                    ? 'bg-[#00B373] text-white shadow-sm'
                    : isCurrent
                    ? 'bg-[#102A24] text-white ring-3 ring-emerald-300 scale-105'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="pt-1">
                <p
                  className={`text-sm font-bold leading-none ${
                    isCurrent ? 'text-[#00B373]' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-slate-500 mt-1">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
