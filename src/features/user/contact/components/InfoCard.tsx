import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type IconProp } from '@fortawesome/fontawesome-svg-core';

type InfoCardProps = {
    icon: IconProp;
    title: string;
    lines: string[];
    subtitle?: string;
}

export default function InfoCard({ icon, title, lines, subtitle }: InfoCardProps) {
    return (
        <div className="bg-white flex flex-col gap-6 rounded-xl h-full hover:shadow-md transition-all duration-300 border-0 cursor-pointer">
            <div className="card-content p-6">
                <div className="icon text-blue-500 mb-4">
                    <FontAwesomeIcon className="text-lg" icon={icon} size="xl"/>
                </div>
                <h3 className="mb-3">{title}</h3>
                <div className="space-y-1 mb-2">
                    {lines.map((line, index) => (
                        <p key={index} className="text-gray-700 text-sm">{line}</p>
                    ))}
                </div>
                {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
            </div>
        </div>
    );
}
