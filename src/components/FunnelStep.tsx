import { Card } from "./Card";

export const FunnelStep = ({ label, count, rate, baseRate, dropoff }: { label: string, count: number, rate: number, baseRate: number, dropoff: number }) => (
  <div className="flex flex-col items-center">
    <Card className="w-64 text-center relative">
      <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{label}</h3>
      <div className="text-3xl font-bold mt-1 text-gray-800">{Math.round(count)}</div>
      {rate && (
        <div className={`text-sm mt-1 font-medium ${rate > baseRate ? 'text-green-500' : 'text-gray-400'}`}>
          {Math.round(rate * 100)}% conversion
        </div>
      )}
    </Card>
    {dropoff && (
      <div className="flex flex-col items-center my-2 text-red-400 text-xs font-medium">
        <span>↓ -{Math.round(dropoff)} drop-off</span>
      </div>
    )}
  </div>
);