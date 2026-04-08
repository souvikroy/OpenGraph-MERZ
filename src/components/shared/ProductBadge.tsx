import type { ProductBrand } from '../../types';

const config: Record<ProductBrand, { bg: string; text: string; dot: string }> = {
  Xeomin: { bg: 'bg-product-xeomin-light', text: 'text-product-xeomin', dot: 'bg-product-xeomin' },
  Belotero: { bg: 'bg-product-belotero-light', text: 'text-product-belotero', dot: 'bg-product-belotero' },
  Radiesse: { bg: 'bg-product-radiesse-light', text: 'text-product-radiesse', dot: 'bg-product-radiesse' },
  Ultherapy: { bg: 'bg-product-ultherapy-light', text: 'text-product-ultherapy', dot: 'bg-product-ultherapy' },
};

interface Props {
  product: ProductBrand;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

export default function ProductBadge({ product, size = 'md', showDot = true }: Props) {
  const c = config[product];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${c.bg} ${c.text} ${
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-0.5'
      }`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />}
      {product}
    </span>
  );
}
