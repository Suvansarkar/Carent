"use client";

import Navbar from "@/app/components/Navbar";
import "leaflet/dist/leaflet.css";
import { Loader2, MapPin } from "lucide-react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import { Icon } from "leaflet";
import { socket } from "@/socket";
import CarImage from "../../images/car.jpeg";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

const customIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
  iconSize: [38, 38],
});

export default function RentCar({ params }: { params: { carId: string } }) {
  const [cars, setCars] = useState([]);
  const [location, setLocation] = useState({ lat: 0.0, long: 0.0 });
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [count, setCount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [available, setAvailable] = useState(false);
  const [price, setPrice] = useState(0);

  const date = new Date();
  const router = useRouter();

  const handleChange = () => {
    if (!startDate || !endDate) {
      setAvailable(false);
      return;
    }
    const startDate2 = new Date(startDate);
    const endDate2 = new Date(endDate);
    fetch(`/api/rent/checker`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate: startDate2.toISOString(),
        endDate: endDate2.toISOString(),
        customerId: "66c4bb6b479fdf6f8403c372",
        carId: params.carId,
      }),
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.status === 200) {
          setAvailable(true);
        } else {
          setAvailable(false);
        }
      });

    setPrice(
      parseInt(
        ((endDate2.getTime() - startDate2.getTime()) / (1000 * 60 * 60 * 24)) *
          0.8 *
          cars.rentRate +
          cars.rentRate
      )
    );
  };

  useEffect(() => {
    handleChange();
  }, [startDate, endDate]);

  useEffect(() => {
    fetch(`/api/cars/${params.carId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.body);
        const loc = data.body.location;
        const [lat, long] = loc.split(",");
        setLocation({ lat: parseFloat(lat), long: parseFloat(long) });
        setCars(data.body);
      });

    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("count", (count) => {
      setCount(count);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex w-full justify-center items-center flex-col">
        <div className="flex justify-center items-center gap-4 flex-wrap">
          <div className="card bg-base-200 w-96 shadow-xl">
            <figure>
              <Image src={CarImage} alt={cars.MMY} placeholder="blur" />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{cars.MMY}</h2>
              <p>Registration: {cars.licenceNumber}</p>
              <p>Pricing: Rs.{cars.rentRate}/day</p>
              <p>Fuel: {cars.fuelType}</p>
              <p>Location: {cars.location}</p>
            </div>
          </div>
          <div className="flex flex-col justify-between items-center">
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Live viewer count</div>
                <div className="stat-value text-center">{count}</div>
                <div className="stat-desc">Book this car ASAP!</div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center bg-base-200 p-4">
              <div className="bg-base-100 p-6 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                  Select Rental Period
                </h2>

                <div className="form-control mb-4">
                  <label htmlFor="startDate" className="label">
                    <span className="label-text">Start Date</span>
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    min={date.toISOString().split("T")[0]}
                    max={endDate}
                    className="input input-bordered w-full"
                    onChange={(e) => {
                      setStartDate(e.target.value);
                    }}
                  />
                </div>

                <div className="form-control mb-6">
                  <label htmlFor="endDate" className="label">
                    <span className="label-text">End Date</span>
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    min={startDate || date.toISOString().split("T")[0]}
                    className="input input-bordered w-full"
                    onChange={(e) => {
                      setEndDate(e.target.value);
                    }}
                  />
                </div>
                <div className="form-control mb-6">
                  <label htmlFor="discount" className="label">
                    <span className="label-text">Discount</span>
                  </label>
                  <input
                    type="text"
                    id="discount"
                    name="discount"
                    className="input input-bordered w-full"
                    onChange={(e) => {
                      if (e.target.value === "123123") {
                        setPrice(price * 0.9);
                        e.target.disabled = true;
                      }
                    }}
                  />
                </div>
                <div> Total Price (dynamically): {price}</div>

                <div className="form-control mt-4">
                  <button
                    className="btn btn-primary w-full"
                    onClick={() => {
                      if (!startDate || !endDate) {
                        toast("Please select a valid date range");
                        return;
                      }
                      const tempDate1 = new Date(startDate);
                      const tempDate2 = new Date(endDate);
                      fetch("/api/rent", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          startDate: tempDate1.toISOString(),
                          endDate: tempDate2.toISOString(),
                          customerId: "66c4bb6b479fdf6f8403c372",
                          carId: params.carId,
                        }),
                      })
                        .then((res) => res.json())
                        .then((res) => {
                          console.log(res);
                          if (res.status === 400) {
                            toast(
                              "Oops! This car is already booked for the selected period. Please try looking at other cars."
                            );
                            return;
                          } else {
                            toast("Car rented successfully!");
                            router.push("/rent");
                          }
                        });
                    }}
                  >
                    Rent this car now!
                  </button>
                </div>
                <div className="text-center">
                  Availablity: {available ? "available" : "not available"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {location.lat === 0.0 && location.long === 0.0 ? (
        <div className="h-[300px] w-full flex justify-center items-center">
          <Loader2 className=" animate-spin" />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <MapContainer
            center={[location.lat, location.long]}
            zoom={13}
            className="h-[300px] w-[80%]"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[location.lat, location.long]}
              icon={customIcon}
            ></Marker>
          </MapContainer>
          <div className="flex">
            <div>{location.lat + ", "} </div>
            <div>{location.long}</div>
          </div>
        </div>
      )}
      <div className="fixed bottom-0 right-0">
        <p>Status: {isConnected ? "connected" : "disconnected"}</p>
        <p>Transport: {transport}</p>
        <p>Live viewers: {count}</p>
      </div>
    </div>
  );
}
