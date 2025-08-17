import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BenefitCard {
  icon: string;
  title: string;
  description: string;
}

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

interface BenefitCardGridProps {
  cards: BenefitCard[];
}

interface PrimaryCTAProps {
  label: string;
  href: string;
}

function Hero({ title, subtitle, ctaText, ctaLink }: HeroProps) {
  return (
    <section className="py-20 px-6 text-center bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {title}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {subtitle}
        </p>
        <Link href={ctaLink}>
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg">
            {ctaText}
          </Button>
        </Link>
      </div>
    </section>
  );
}

function BenefitCardGrid({ cards }: BenefitCardGridProps) {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="text-4xl mb-4">{card.icon}</div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {card.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function PrimaryCTA({ label, href }: PrimaryCTAProps) {
  return (
    <section className="py-16 px-6 bg-green-50 text-center">
      <div className="max-w-2xl mx-auto">
        <Link href={href}>
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 text-lg">
            {label}
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default function SeraGPTLanding() {
  const heroData = {
    title: "Tarımda Geleceği Analiz Edin",
    subtitle: "Yapay zekâ ile sera verimliliğinizi artırın. İlk analiz ücretsiz.",
    ctaText: "Ücretsiz Analiz Başlat",
    ctaLink: "/analysis"
  };

  const benefitCards = [
    {
      icon: "🌱",
      title: "Sera Verimlilik Analizi",
      description: "Enerji, sulama ve gübre kullanımını optimize edin."
    },
    {
      icon: "📈",
      title: "Pazar Analizi",
      description: "Talep ve fiyat trendlerini anında görün."
    },
    {
      icon: "🔍",
      title: "Sorun Teşhisi",
      description: "Hava, toprak ve hastalık risklerini belirleyin."
    },
    {
      icon: "🤖",
      title: "AI Asistan",
      description: "Uzman bir tarım danışmanıyla sohbet edin."
    }
  ];

  const ctaData = {
    label: "Ücretsiz Analizi Başlat",
    href: "/analysis"
  };

  return (
    <div className="min-h-screen bg-white">
      <Hero {...heroData} />
      <BenefitCardGrid cards={benefitCards} />
      <PrimaryCTA {...ctaData} />
    </div>
  );
}
