interface Props {
  title: string;
  description: string;
}

export default function RecommendationCard({ title, description }: Props) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-md transition">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-gray-700 mt-2">{description}</p>
    </div>
  );
}
