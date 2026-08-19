import React, { useState } from 'react';

// 1. Definimos la estructura de los elementos multimedia
export interface MediaItem {
  id: string;
  title: string;
  artist: string;
  duration: string;
  type: 'video' | 'music' | 'mix';
  thumbnailUrl: string;
  downloadAllowed: boolean;
}

export function SearchView() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MediaItem[]>([]);

  // 2. Función que procesa la búsqueda o el enlace pegado
  const handleSearchExecution = (searchQuery: string) => {
    const cleanQuery = searchQuery.trim();
    if (!cleanQuery) {
      setResults([]);
      return;
    }

    const isUrl = cleanQuery.startsWith('http://') || cleanQuery.startsWith('https://');

    if (isUrl) {
      // Si el usuario pega un enlace compatible
      setResults([
        {
          id: 'url-result-1',
          title: `Contenido extraído del enlace: ${cleanQuery.substring(0, 25)}...`,
          artist: 'Canal Verificado / DJ',
          duration: '3:45',
          type: 'mix',
          thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500',
          downloadAllowed: true,
        }
      ]);
    } else {
      // Si el usuario escribe el nombre de un artista, canción o mezcla de DJ (ej: Ozuna, Reggaeton, etc.)
      setResults([
        {
          id: 'search-1',
          title: `${cleanQuery} (Remix Oficial / DJ Mix)`,
          artist: 'DJ Joaofficial / El flaquito de oriente',
          duration: '4:20',
          type: 'mix',
          thumbnailUrl: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=500',
          downloadAllowed: true,
        },
        {
          id: 'search-2',
          title: `Éxito destacado - ${cleanQuery}`,
          artist: 'Artista Invitado',
          duration: '3:15',
          type: 'music',
          thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500',
          downloadAllowed: true,
        }
      ]);
    }
  };

  return (
    <div className="p-4 text-white">
      <h2 className="text-xl font-bold mb-4 text-[#00FF66]">Búsqueda y Enlaces</h2>
      
      {/* Barra de búsqueda / Pegar enlace */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca un artista, música o pega tu enlace aquí..."
          className="w-full p-3 bg-[#1E1E1E] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#00FF66]"
        />
        <button
          onClick={() => handleSearchExecution(query)}
          className="px-5 bg-[#00FF66] text-black font-bold rounded-lg hover:bg-[#00CC52] transition"
        >
          Buscar
        </button>
      </div>

      {/* Listado de resultados generados */}
      <div className="space-y-4">
        {results.map((item) => (
          <div key={item.id} className="flex items-center gap-4 bg-[#1E1E1E] p-3 rounded-lg border border-gray-800">
            <img src={item.thumbnailUrl} alt={item.title} className="w-20 h-20 object-cover rounded" />
            <div className="flex-1">
              <h3 className="font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.artist} • {item.duration}</p>
            </div>
            {item.downloadAllowed && (
              <button className="px-3 py-1 bg-gray-800 text-[#00FF66] border border-[#00FF66] text-sm rounded hover:bg-[#00FF66] hover:text-black transition">
                Descargar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
