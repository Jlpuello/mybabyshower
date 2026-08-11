import { MoreHorizontal, Image as ImageIcon, Video } from 'lucide-react';

interface MemoriesTableProps {
  memories: Array<{
    publicId: string;
    title: string;
    mediaType: 'IMAGE' | 'VIDEO';
    eventDate: Date | null;
    isPublished: boolean;
  }>;
}

export const MemoriesTable = ({ memories }: MemoriesTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow-soft overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-ivory">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {memories.map((memory) => (
              <tr key={memory.publicId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-textPrimary">
                  {memory.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">
                  <div className="flex items-center gap-2">
                    {memory.mediaType === 'IMAGE' ? (
                      <ImageIcon className="w-4 h-4" />
                    ) : (
                      <Video className="w-4 h-4" />
                    )}
                    <span>{memory.mediaType === 'IMAGE' ? 'Imagen' : 'Video'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">
                  {memory.eventDate ? new Date(memory.eventDate).toLocaleDateString('es-ES') : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${memory.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {memory.isPublished ? 'Publicado' : 'Borrador'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">
                  <button className="text-textLight hover:text-textPrimary">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {memories.length === 0 && (
        <div className="text-center py-8 text-textSecondary">
          No hay recuerdos registrados
        </div>
      )}
    </div>
  );
};
