// interface Props {
//   title: string;
//   subtitle: string;
// }

// export const Title = ({ title, subtitle }: Props) => {
//   return (
//     <div className="mb-2">
//       <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
//       <p className="text-gray-600">{subtitle}</p>
//     </div>
//   );
// };

interface Props {
  title: string;
  subtitle: string;
}

export const Title = ({ title, subtitle }: Props) => {
  return (
    <div className="mb-2">
      {/* Título: Usamos gray-900 y font-bold para que destaque como los items activos */}
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
        {title}
      </h1>
      
      {/* Subtítulo: Usamos un gris más suave (gray-500) y un tamaño pequeño */}
      <p className="text-sm font-medium text-gray-500 mt-1">
        {subtitle}
      </p>
    </div>
  );
};