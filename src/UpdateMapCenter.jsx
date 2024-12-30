//קומפוננטה שהיא תציג את המיקום שנבחר מתוך ההשלמה האוטומטית
import { marker } from 'leaflet';
import { useMap } from 'react-leaflet'


const UpdateMapCenter = (prop) => {
    
  
    const map = useMap();
    map.setView(prop.center)
    return null
}

export default UpdateMapCenter