import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  startTime: string;
  endTime: string;
}

export function Timer({ startTime, endTime }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const difference = end - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft('Time expired');
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      setIsExpired(false);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="flex items-center gap-2">
      <Clock className={`w-5 h-5 ${isExpired ? 'text-red-600' : 'text-gray-600'}`} />
      <div className="text-right">
        <p className="text-sm text-gray-600">Time Left</p>
        <p className={`text-lg font-semibold ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
          {timeLeft}
        </p>
      </div>
    </div>
  );
}
