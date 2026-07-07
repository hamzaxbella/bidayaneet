type PartnerLogoProps = {
  name: string;
  size?: number;
};

type LogoAsset = {
  src: string;
  bg: string;
  size?: string;
};

const logoAssets: Record<string, LogoAsset> = {
  anapec: { src: '/logos/anapec.png', bg: '#F8FBFF', size: '78%' },
  indh: { src: '/logos/indh.jpg', bg: '#FFFFFF', size: '92%' },
  ofppt: { src: '/logos/ofppt.png', bg: '#FFFFFF', size: '76%' },
  onmt: { src: '/logos/onmt.png', bg: '#1A1A1A', size: '82%' },
  ministryTourism: { src: '/logos/ministry-tourism.png', bg: '#FFFFFF', size: '92%' },
  hospitalityTraining: { src: '/logos/hospitality-training-hub.svg', bg: '#EAF7FF', size: '100%' },
  ministryAgriculture: { src: '/logos/ministry-agriculture.png', bg: '#FFFFFF', size: '92%' },
  ada: { src: '/logos/ada.png', bg: '#FFFFFF', size: '88%' },
  ormvasm: { src: '/logos/ormvasm.png', bg: '#FFFFFF', size: '84%' },
  ministryEconomicInclusion: { src: '/logos/ministry-economic-inclusion.png', bg: '#FFFFFF', size: '92%' },
  mjcc: { src: '/logos/mjcc.svg', bg: '#FFFFFF', size: '92%' },
  localInternships: { src: '/logos/local-internships.svg', bg: '#FFF7E8', size: '100%' },
  microActions: { src: '/logos/micro-actions.svg', bg: '#E0F7F5', size: '100%' },
  default: { src: '/logos/default-program.svg', bg: '#F5EEF8', size: '100%' },
};

function normalizePartner(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('anapec')) return 'anapec';
  if (lower.includes('indh')) return 'indh';
  if (lower.includes('ofppt')) return 'ofppt';
  if (lower.includes('onmt') || lower.includes('visit morocco')) return 'onmt';
  if (lower.includes('hospitality')) return 'hospitalityTraining';
  if (lower.includes('tourism') || lower.includes('tourisme') || lower.includes('handicraft')) return 'ministryTourism';
  if (lower.includes('ada') || lower.includes('agripreneur')) return 'ada';
  if (lower.includes('ormva')) return 'ormvasm';
  if (lower.includes('agriculture') || lower.includes('agricultural') || lower.includes('fisheries') || lower.includes('forests')) return 'ministryAgriculture';
  if (lower.includes('economic inclusion') || lower.includes('employment') || lower.includes('competence') || lower.includes('inclusion')) return 'ministryEconomicInclusion';
  if (lower.includes('youth') || lower.includes('culture') || lower.includes('communication')) return 'mjcc';
  if (lower.includes('internship') || lower.includes('local')) return 'localInternships';
  if (lower.includes('micro')) return 'microActions';
  return 'default';
}

export default function PartnerLogo({ name, size = 48 }: PartnerLogoProps) {
  const type = normalizePartner(name);
  const logo = logoAssets[type] ?? logoAssets.default;

  return (
    <div
      role="img"
      aria-label={`${name} logo`}
      title={`${name} logo`}
      style={{
        width: size,
        height: size,
        borderRadius: 12,
        border: '1px solid #E8ECF0',
        backgroundColor: logo.bg,
        backgroundImage: `url("${logo.src}")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: logo.size ?? '82%',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        flexShrink: 0,
      }}
    />
  );
}
