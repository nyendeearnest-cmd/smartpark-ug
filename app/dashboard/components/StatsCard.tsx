import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
};

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color,
}: Props) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-5">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div className={`${color} p-4 rounded-xl text-white`}>
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
}