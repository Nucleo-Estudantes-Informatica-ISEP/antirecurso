import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ChangelogVersionProps {
  title: string;
  date: Date;
  updates: React.ReactNode[];
  children?: React.ReactNode;
}

const ChangelogVersion: React.FC<ChangelogVersionProps> = ({ title, date, updates, children }) => {
  return (
    <article className="relative">
      {/* timeline dot */}
      <div className="absolute -left-[2.6rem] top-7 hidden md:block">
        <div className="size-3 rounded-full bg-primary ring-4 ring-primary/15" />
      </div>

      <Card className="transition-colors hover:border-primary/30">
        <CardContent className="p-5 md:p-7">
          <div className="flex flex-wrap items-baseline gap-3 mb-3">
            <h3 className="font-bold text-primary text-xl md:text-2xl">{title}</h3>
            <Badge variant="outline" className="font-medium">
              {date.toLocaleDateString('pt-PT', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </Badge>
          </div>
          {children && (
            <div className="text-sm md:text-base text-foreground/90 mb-4 leading-relaxed">
              {children}
            </div>
          )}
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
            Novidades
          </p>
          <ul className="space-y-2 text-sm md:text-base">
            {updates.map((update, i) => (
              <li className="flex gap-3 leading-relaxed" key={i}>
                <span className="text-primary mt-2 flex-none size-1.5 rounded-full bg-primary" />
                <span className="flex-1">{update}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </article>
  );
};

export default ChangelogVersion;
