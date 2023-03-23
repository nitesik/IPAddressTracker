import "./Styles.css";
import arrow from "./Images/icon-arrow.svg";
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import { useEffect, useState } from "react";


function Home() {

  const [jsonData, setJsonData] = useState<any>("");
  const [ip, setIp] = useState<string>("");
  const [loaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  
  function formHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoaded(false);
    getData();
  }

  async function getData() {
    const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${import.meta.env.VITE_API_KEY}&ipAddress=${ip}`);
    const data = await response.json();

    if (response.ok) {
      setJsonData(data);
      setLoaded(true);
      setError(false);
    }

    if (response.status !== 200)
      setError(true);
    
  }

  useEffect(() => {
    getData();
    console.log(import.meta.env);
    
  }, [loaded]);

  return (
    <div className="container">
      <div className="header">
        <div className="inner-header">
          <div className="title">IP Address Tracker</div>
          <form onSubmit={formHandler}>
            <input placeholder="Enter IP Address" type="text" onChange={e => setIp(e.target.value)} />
            <button type="submit"> <img src={arrow} alt="arrow" /></button>
          </form>
          <div className={`${error || "stats"}`}>
            {loaded && <div>
              <div>
                <div className="text">IP ADDRESS</div>
                <div className="description">{jsonData.ip}</div>
              </div>
              <hr />
              <div>
                <div className="text">LOCATION</div>
                <div className="description">{jsonData.location.city}, {jsonData.location.country}</div>
              </div>
              <hr />
              <div>
                <div className="text">TIMEZONE</div>
                <div className="description">{jsonData.location.timezone}</div>
              </div>
              <hr />
              <div>
                <div className="text">ISP</div>
                <div className="description">{jsonData.isp}</div>
              </div>
            </div>}
          </div>
        </div>
      </div>
        {loaded ? <MapContainer center={[jsonData.location.lat, jsonData.location.lng]} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[jsonData.location.lat, jsonData.location.lng]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer> : error ? <div className="loading">Error IP Address</div> : <div className="loading">Loading...</div>}
    </div>
  )
}

export default Home;