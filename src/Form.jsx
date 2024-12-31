
import "./App.css"; // ייבוא הקובץ CSS עבור עיצוב הרכיב
import { useState } from "react"; // ייבוא ההוק useState מ-React לניהול מצב
import * as React from "react"; // ייבוא React
import TextField from "@mui/material/TextField"; // ייבוא רכיב TextField מ-Material-UI עבור שדות קלט
import Autocomplete from "@mui/material/Autocomplete"; // ייבוא רכיב Autocomplete להצעות כתובת
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"; // ייבוא רכיבי React Leaflet עבור פונקציונליות של מפה
import "leaflet/dist/leaflet.css"; // ייבוא CSS של Leaflet עבור עיצוב המפה
import { useForm, Controller } from "react-hook-form"; // ייבוא useForm ו-Controller מ-react-hook-form לניהול טופס
import UpdateMapCenter from "./UpdateMapCenter"; // ייבוא רכיב מותאם אישית לעדכון מרכז המפה

export default function Form() { // הגדרת רכיב Form
  const {
    register, // פונקציה לרישום שדות קלט
    handleSubmit, // פונקציה לניהול שליחת הטופס
    control, // אובייקט בקרה לשליטה על רכיבי הקלט
    formState: { errors, isValid }, // חילוץ שגיאות ו-validity ממצב הטופס
  } = useForm({
    mode: "all", // אימות מתבצע בכל אינטראקציה, כולל טעינת התחל
  });

  const [addresses, setAddresses] = useState([]); // משתנה מצב לשמירת הצעות הכתובת
  const [data, setData] = useState([]); // משתנה מצב לשמירת הנתונים שהושגו מה-API
  const [lat, setLat] = useState(30.8124247); // משתנה מצב לשמירת ערך קו הרוחב
  const [lon, setLon] = useState(34.8594762); // משתנה מצב לשמירת ערך קו האורך
  const [name, setName] = useState(""); // משתנה מצב לשמירת שם לחלון הקופץ של הסמן

  async function nominatim_API(e) { // פונקציה אסינכרונית להשגת כתובות מ-API של Nominatim על בסיס קלט המשתמש
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${e}&limit=5` // השגת כתובות עם פרמטר שאלה
      );
      const results = await response.json(); // הפיכת תגובת JSON לאובייקט
      setData(results); // שמירת התוצאות במצב data
      const displayNames = results.map((item) => item.display_name); // מיפוי התוצאות לשמות מוצגים
      setAddresses(displayNames); // שמירת השמות המוצגים במצב addresses
    } catch (err) {
      console.error(err); // הדפסת שגיאות לקונסולה
    }
  }

  function getDetails(select) { // פונקציה לקבלת קו רוחב וקו אורך של הכתובת שנבחרה
    const find = data.find((address) => address.display_name === select); // חיפוש הכתובת בdata
    if (find) { // אם נמצא הכתובת
      setLat(find.lat); // הגדרת מצב קו הרוחב
      setLon(find.lon); // הגדרת מצב קו האורך
      setName(find.display_name); // הגדרת מצב השם לחלון קופץ
    }
  }

  const onSubmit = (data) => { // פונקציה לניהול שליחת הטופס
    console.log(data); // הדפסת נתוני הטופס לקונסולה
  };

  return (
    <div className="container">
       {/* // הקונטיינר הראשי עבור הטופס והמפה */}
      <div className="form-container">
         {/* // קונטיינר עבור הטופס */}
        <form onSubmit={handleSubmit(onSubmit)}> 
          {/* // רכיב הטופס עם מנהל onSubmit */}
          <div className="form-fields">
             {/* // קונטיינר עבור שדות הטופס */}
            {/* שם משתמש */}
            <label htmlFor="username">User Name:</label>
             {/* // תווית עבור קלט שם המשתמש */}
            <input // שדה קלט עבור שם המשתמש
              {...register("username", { // רישום הקלט עם כללי אימות
                required: "שדה שם משתמש הוא חובה", // הודעת חובה בעברית
                minLength: {
                  value: 2, // אורך מינימלי של 2 תווים
                  message: "הכנס לפחות 2 תווים", // הודעת אורך מינימלי בעברית
                },
              })}
              placeholder="שם משתמש" // טקסט מחפש
              type="text" // סוג קלט
            />
            {errors.username && ( // רינדור מותנה עבור שגיאת שם המשתמש
              <div className="error-message">{errors.username.message}</div> // הצגת הודעת השגיאה
            )}

            {/* חיפוש כתובת */}
            <Controller
              name="address" // שם עבור שדה הכתובת
              control={control} // אובייקט בקרה עבור קלט זה
              // rules={{ required: "שדה כתובת הוא חובה" }} // כללי אימות (מגודלים)
              render={({ field }) => ( // רכיב פועל עבור רכיב מבוקר
                <Autocomplete
                  {...field} // הפצת פרטי השדה עבור Autocomplete
                  options={addresses} // אפשרויות עבור Autocomplete
                  getOptionLabel={(option) => option || ""} // קבלת התווית של האפשרות
                  onInputChange={(e, value) => nominatim_API(value)} // השגת כתובות בעת שינוי הקלט
                  onChange={(e, value) => getDetails(value)} // קבלת פרטי הכתובת בעת שינוי
                  renderInput={(params) => ( // רינדור קלט בתוך Autocomplete
                    <TextField
                      {...params} // הפצת פרמטרים עבור TextField
                      label="כתובת לחיפוש" // תווית בעברית
                      variant="outlined" // סוג TextField
                      error={!!errors.address} // מצב שגיאה
                      helperText={errors.address?.message} // טקסט עזרה מותנה עבור שגיאות
                    />
                  )}
                />
              )}
            />

            {/* טלפון */}
            <label htmlFor="phone">Phone:</label> 
            <input // שדה קלט עבור טלפון
              {...register("phone", { // רישום הקלט עם כללי אימות
                required: "שדה טלפון הוא חובה", // הודעת חובה בעברית
                pattern: {
                  value: /^[0-9]{10}$/, // תבנית עבור מספר טלפון בן 10 ספרות
                  message: "הכנס טלפון בתבנית נכונה", // הודעת שגיאה בעברית
                },
              })}
              placeholder="טלפון" // טקסט מחפש
              type="text" // סוג קלט
            />
            {errors.phone && ( // רינדור מותנה עבור שגיאת הטלפון
              <div className="error-message">{errors.phone.message}</div> // הצגת הודעת השגיאה
            )}

            {/* דוא"ל */}
            <label htmlFor="email">Email:</label>  
            <input // שדה קלט עבור דוא"ל
              {...register("email", { // רישום הקלט עם כללי אימות
                required: "שדה כתובת מייל הוא חובה", // הודעת חובה בעברית
                pattern: {
                  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, // תבנית דוא"ל
                  message: "כתובת מייל לא תקינה", // הודעת שגיאה עבור דוא"ל לא תקין בעברית
                },
              })}
              placeholder="כתובת מייל" // טקסט מחפש
              type="email" // סוג קלט
            />
            {errors.email && ( // רינדור מותנה עבור שגיאת הדוא"ל
              <div className="error-message">{errors.email.message}</div> // הצגת הודעת השגיאה
            )}

            {/* חיבור לאינטרנט נדרש */}
            <label> 
              <input {...register("internetRequired")} type="checkbox" /> 
              האם נדרש חיבור לאינטרנט
            </label>

            {/* מטבח נדרש */}
            <label> 
              <input {...register("kitchenRequired")} type="checkbox" />  
              האם נדרש מטבח
            </label>

            {/* מכונת קפה נדרשת */}
            <label> 
              <input {...register("coffeeMachineRequired")} type="checkbox" /> 
              האם נדרשת מכונת קפה
            </label>

            {/* חדרים */}
            <label htmlFor="rooms">Rooms:</label> 
            <input // שדה קלט עבור מספר חדרים
              {...register("rooms", { // רישום הקלט עם כללי אימות
                required: "שדה מספר חדרים הוא חובה", // הודעת חובה בעברית
                min: {
                  value: 1, // ערך מינימלי של 1
                  message: "מספר חדרים מינימלי הוא 1", // הודעת חדר מינימלי בעברית
                },
              })}
              placeholder="מספר חדרים" // טקסט מחפש
              type="number" // סוג קלט
            />
            {errors.rooms && ( // רינדור מותנה עבור שגיאת חדרים
              <div className="error-message">{errors.rooms.message}</div> // הצגת הודעת השגיאה
            )}

            {/* מרחק */}
            <label htmlFor="distance">Distance:</label> 
            {/* // תווית עבור קלט המרחק */}
            <input // שדה קלט עבור מרחק
              {...register("distance", { // רישום הקלט עם כללי אימות
                required: "שדה מרחק מהכתובת הוא חובה", // הודעת חובה בעברית
                min: {
                  value: 0, // ערך מינימלי של 0
                  message: "המרחק חייב להיות חיובי", // הודעת מרחק חיובי בעברית
                },
              })}
              placeholder="מרחק מהכתובת (בקילומטרים)" // טקסט מחפש
              type="number" // סוג קלט
            />
            {errors.distance && ( // רינדור מותנה עבור שגיאת מרחק
              <div className="error-message">{errors.distance.message}</div> // הצגת הודעת השגיאה
            )}

            {/* כפתור שליחה */}
            <button type="submit" disabled={!isValid}> 
              {/* // כפתור שליחה עם מצב מושבת לא לחיץ בהתאם לתוקף הטופס */}
              Submit 
            </button>
          </div>
        </form>
      </div>

      <div className="map-container"> 
      {/* // קונטיינר עבור המפה */}
        <MapContainer
          center={[lat, lon]} // מרכז המפה מבוסס על ערכי קו רוחב וקו אורך
          zoom={13} // רמת זום התחל של המפה
          scrollWheelZoom={true} // אפשרות לזום בעזרת גלילה
          style={{ height: "100%", width: "100%" }} // עיצוב המפה לגובה ורוחב מלאים
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' // קרדיט לשכבת האריחים
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // תבנית URL עבור האריחים
          />
          <UpdateMapCenter center={[lat, lon]} /> 
          {/* // רכיב לעדכון מרכז המפה */}
          <Marker position={[lat, lon]}> 
            {/* // סמן במיקום קו רוחב וקו אורך שנבחרו */}
            <Popup>{name}</Popup> 
            {/* // חלון קופץ המראה את השם כאשר הסמן נלחץ */}
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

