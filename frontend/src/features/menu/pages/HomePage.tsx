import { Link } from 'react-router-dom';
import { Flame, Truck, Clock3 } from 'lucide-react';
import { Card } from '@/shared/components/Card';
import { ClosedBanner } from '@/features/business-hours/components/ClosedBanner';

const HIGHLIGHTS = [
  {
    icon: Flame,
    title: 'Sabor a leña',
    text: 'Cocinamos cada pieza en horno de leña, como se debe.',
  },
  {
    icon: Truck,
    title: 'Entrega a domicilio',
    text: 'Recibe tu pedido calientito directo en tu puerta.',
  },
  {
    icon: Clock3,
    title: 'Pedido por WhatsApp',
    text: 'Confirmamos tu pedido directo por WhatsApp, sin vueltas.',
  },
];

export function HomePage() {
  return (
    <div className="flex flex-col gap-12">
      <section className="text-center py-12 flex flex-col items-center gap-5">
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-white max-w-2xl">
          Leños <span className="text-primary">Rellenos</span>
        </h1>
        <p className="text-beige/70 max-w-xl">
          Antojitos artesanales cocinados a leña. Pide en línea y te lo llevamos
          hasta tu casa.
        </p>
        <div className="w-full max-w-md">
          <ClosedBanner />
        </div>
        <Link
          to="/menu"
          className="inline-flex items-center justify-center gap-2 font-semibold rounded-btn px-7 py-3.5 text-base bg-primary hover:bg-secondary text-white shadow-lg shadow-primary/30 hover:shadow-secondary/40 transition-all duration-200"
        >
          Ver menú
        </Link>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
          <Card
            key={title}
            className="p-5 flex flex-col items-center text-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center text-primary">
              <Icon size={22} />
            </div>
            <h3 className="font-heading font-semibold text-white">{title}</h3>
            <p className="text-sm text-beige/70">{text}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
