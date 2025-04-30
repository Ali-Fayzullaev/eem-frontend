import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useRef, useEffect } from 'react';

const MyMap = () => {
  const mapRef = useRef(null);
  
  // Mock данные событий
  const mockEvents = [
    { id: 1, name: "Тошкент китоб жамғармаси", lng: 69.2165, lat: 41.3405 },
    { id: 2, name: "Анхор кўлида концерт", lng: 69.2001, lat: 41.3102 }
  ];

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: 'https://api.maptiler.com/maps/streets/style.json?key=RnGN0JG3amT4NY2vFR3a', // Бесплатный ключ тут: https://cloud.maptiler.com, 
      center: [69.2406, 41.8782212], // Тошкент
      zoom: 12
    });

    // Ожидаем загрузки карты
    map.on('load', () => {
      // Добавляем маркеры для каждого события
      mockEvents.forEach(event => {
        new maplibregl.Marker()
          .setLngLat([event.lng, event.lat])
          .setPopup(new maplibregl.Popup().setHTML(`
            <h3>${event.name}</h3>
            <a href="/event/${event.id}">Подробнее</a>
          `))
          .addTo(map);
      });
    });

    return () => map.remove();
  }, []);

  return <div ref={mapRef} style={{ height: "400px", width: "100%", borderRadius: "8px" }} />;
};

export default MyMap;
