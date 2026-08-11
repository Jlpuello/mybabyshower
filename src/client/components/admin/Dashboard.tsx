import { memo } from 'react';
import { Users, Gift, Calendar, CheckCircle } from 'lucide-react';

interface DashboardProps {
  stats: {
    totalGuests: number;
    confirmedGuests: number;
    declinedGuests: number;
    totalGifts: number;
    reservedGifts: number;
    totalMemories: number;
  };
}

export const Dashboard = memo(({ stats }: DashboardProps) => {
  const cards = [
    {
      title: 'Total Invitados',
      value: stats.totalGuests,
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Confirmados',
      value: stats.confirmedGuests,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Regalos Reservados',
      value: `${stats.reservedGifts}/${stats.totalGifts}`,
      icon: Gift,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Recuerdos',
      value: stats.totalMemories,
      icon: Calendar,
      color: 'bg-pink-100 text-pink-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div key={card.title} className="bg-white p-6 rounded-lg shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-textSecondary mb-1">{card.title}</p>
              <p className="text-3xl font-bold text-textPrimary">{card.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});
