import "./App.css";
import { useState } from "react";
import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useForm, Controller } from "react-hook-form";
import UpdateMapCenter from "./UpdateMapCenter";

export default function Form() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    mode: "all", // Validation triggers on all interactions, including initial load
  });

  const [addresses, setAddresses] = useState([]);
  const [data, setData] = useState([]);
  const [lat, setLat] = useState(30.8124247);
  const [lon, setLon] = useState(34.8594762);
  const [name, setName] = useState("");

  async function nominatim_API(e) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${e}&limit=5`
      );
      const results = await response.json();
      setData(results);
      const displayNames = results.map((item) => item.display_name);
      setAddresses(displayNames);
    } catch (err) {
      console.error(err);
    }
  }

  function getDetails(select) {
    const find = data.find((address) => address.display_name === select);
    if (find) {
      setLat(find.lat);
      setLon(find.lon);
      setName(find.display_name);
    }
  }

  const onSubmit = (data) => {
    console.log(data); 
  };

  return (
    <div className="container">
      <div className="form-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-fields">
            {/* User Name */}
            <label htmlFor="username">User Name:</label>
            <input
              {...register("username", {
                required: "שדה שם משתמש הוא חובה",
                minLength: {
                  value: 2,
                  message: "הכנס לפחות 2 תווים",
                },
              })}
              placeholder="שם משתמש"
              type="text"
            />
            {errors.username && (
              <div className="error-message">{errors.username.message}</div>
            )}

            {/* Address Search */}
            <Controller
              name="address"
              control={control}
            //   rules={{ required: "שדה כתובת הוא חובה" }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={addresses}
                  getOptionLabel={(option) => option || ""}
                  onInputChange={(e, value) => nominatim_API(value)}
                  onChange={(e, value) => getDetails(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="כתובת לחיפוש"
                      variant="outlined"
                      error={!!errors.address}
                      helperText={errors.address?.message}
                    />
                  )}
                />
              )}
            />

            {/* Phone */}
            <label htmlFor="phone">Phone:</label>
            <input
              {...register("phone", {
                required: "שדה טלפון הוא חובה",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "הכנס טלפון בתבנית נכונה",
                },
              })}
              placeholder="טלפון"
              type="text"
            />
            {errors.phone && (
              <div className="error-message">{errors.phone.message}</div>
            )}

            {/* Email */}
            <label htmlFor="email">Email:</label>
            <input
              {...register("email", {
                required: "שדה כתובת מייל הוא חובה",
                pattern: {
                  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                  message: "כתובת מייל לא תקינה",
                },
              })}
              placeholder="כתובת מייל"
              type="email"
            />
            {errors.email && (
              <div className="error-message">{errors.email.message}</div>
            )}

            {/* Internet Required */}
            <label>
              <input {...register("internetRequired")} type="checkbox" />
              האם נדרש חיבור לאינטרנט
            </label>

            {/* Kitchen Required */}
            <label>
              <input {...register("kitchenRequired")} type="checkbox" />
              האם נדרש מטבח
            </label>

            {/* Coffee Machine Required */}
            <label>
              <input {...register("coffeeMachineRequired")} type="checkbox" />
              האם נדרשת מכונת קפה
            </label>

            {/* Rooms */}
            <label htmlFor="rooms">Rooms:</label>
            <input
              {...register("rooms", {
                required: "שדה מספר חדרים הוא חובה",
                min: {
                  value: 1,
                  message: "מספר חדרים מינימלי הוא 1",
                },
              })}
              placeholder="מספר חדרים"
              type="number"
            />
            {errors.rooms && (
              <div className="error-message">{errors.rooms.message}</div>
            )}

            {/* Distance */}
            <label htmlFor="distance">Distance:</label>
            <input
              {...register("distance", {
                required: "שדה מרחק מהכתובת הוא חובה",
                min: {
                  value: 0,
                  message: "המרחק חייב להיות חיובי",
                },
              })}
              placeholder="מרחק מהכתובת (בקילומטרים)"
              type="number"
            />
            {errors.distance && (
              <div className="error-message">{errors.distance.message}</div>
            )}

            {/* Submit Button */}
            <button type="submit" disabled={!isValid}>
              Submit
            </button>
          </div>
        </form>
      </div>

      <div className="map-container">
        <MapContainer
          center={[lat, lon]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <UpdateMapCenter center={[lat, lon]} />
          <Marker position={[lat, lon]}>
            <Popup>{name}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}


