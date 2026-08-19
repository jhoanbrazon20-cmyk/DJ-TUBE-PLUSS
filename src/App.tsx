import React, { useEffect } from 'react';
import { SearchView } from './views/SearchView';

export function App() {
  useEffect(() => {
    // Captura si la app fue abierta mediante la opción "Compartir" de otra plataforma (como Facebook)
    const urlParams = new URLSearchParams(window.location.search);
    const sharedUrl = urlParams.get('text') || urlParams.get('url');

    if (sharedUrl) {
      console.log("Enlace recibido para procesar en DJ Tube:", sharedUrl);
      // Aquí puedes redirigir automáticamente al buscador con el enlace ya pegado
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#00FF66]">DJ Tube</h1>
      </header>
      <main className="p-4">
        <SearchView />
      </main>
    </div>
  );
}

export default App;
