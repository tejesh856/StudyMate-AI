'use client';

import Image from 'next/image';
import { Sparkles } from 'lucide-react';

export default function EmptyState({
  image = '/empty.svg',
  title = 'Nothing Found',
  description = 'Try adjusting your filters or create a new item to get started!',
  buttonLabel = 'Create Now',
  onClick = () => {},
  showIcon = true,
}) {
  return (
    <div className="min-h-[300px] flex flex-col items-center justify-center gap-6 text-center animate-fade-in">
      {/* SVG Image */}
      <Image
        src={image}
        alt={title}
        width={160}
        height={160}
        className="mx-auto"
      />

      {/* Text Content */}
      <div>
        <h2 className="text-xl font-bold text-base-content">{title}</h2>
        <p className="text-base-content/70 text-sm">{description}</p>
      </div>

      {/* CTA Button */}
      <button
        onClick={onClick}
        className="btn btn-outline btn-primary gap-2"
      >
        {showIcon && <Sparkles className="w-4 h-4" />}
        {buttonLabel}
      </button>
    </div>
  );
}
