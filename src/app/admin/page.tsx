"use client";

import { Trash, UploadCloud } from "lucide-react";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Icon } from "leaflet";

export default function AdminPage() {
  const [cars, setCars] = useState([]);
  const [mmy, setMmy] = useState("");
  const [licence, setLicence] = useState("");
  const [fuel, setFuel] = useState("Petrol");
  const [rate, setRate] = useState("");
  const [location, setLocation] = useState({ lat: 0.0, long: 0.0 });
  const router = useRouter();

  const customIcon = new Icon({
    // iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
    iconUrl:
      "https://w7.pngwing.com/pngs/236/41/png-transparent-illustration-of-map-icon-google-map-maker-google-maps-computer-icons-map-marker-text-heart-logo-thumbnail.png",
    iconSize: [38, 38],
  });

  useEffect(() => {
    fetch("/api/cars")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.body);
        setCars(data.body);
      });
  }, []);

  let Latitude = 0;
  return (
    <>
      <Navbar />
      <div className="p-8">
        <ToastContainer />
        <div className="text-7xl font-bold text-center mb-8">Admin Panel</div>
        <div className="w-full h-full flex flex-col justify-center items-center">
          <MapContainer
            center={[location.lat, location.long]}
            zoom={13}
            className="h-[300px] w-[80%] z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {cars.map((car, index) => {
              const loc = car.location.split(",");
              return (
                <Marker
                  key={index}
                  position={[Number(loc[0]), Number(loc[1])]}
                  icon={customIcon}
                ></Marker>
              );
            })}
          </MapContainer>
          <div className="flex">
            <div>{location.lat + ", "} </div>
            <div>{location.long}</div>
          </div>
        </div>
        <div className="drawer drawer-end z-[99]">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label
              htmlFor="my-drawer-4"
              className="drawer-button btn btn-primary fixed bottom-4 right-8"
            >
              Add a car
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer-4"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <div className="menu bg-base-200 text-base-content min-h-full w-[400px] md:w-[600px] p-4">
              <div className="text-xl text-center font-bold mb-2">
                Add a car
              </div>
              <div className="flex flex-col gap-4">
                <label className="input input-bordered flex items-center gap-2">
                  <input
                    type="text"
                    className="grow"
                    placeholder="Model Make and Year"
                    value={mmy}
                    onChange={(e) => setMmy(e.target.value)}
                  />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <input
                    type="text"
                    className="grow"
                    placeholder="License"
                    value={licence}
                    onChange={(e) => setLicence(e.target.value)}
                  />
                </label>

                <select
                  className="select select-bordered w-full"
                  onChange={(e) => {
                    setFuel(e.target.value);
                  }}
                >
                  <option selected>Petrol</option>
                  <option>Diesel</option>
                  <option>Electric</option>
                </select>

                <label className="input input-bordered flex items-center gap-2">
                  <input
                    type="number"
                    className="grow"
                    placeholder="Rate"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                  />
                </label>
                <div>Location</div>
                <div className="flex gap-2">
                  <label className="input input-bordered flex w-full items-center gap-2">
                    <input
                      type="text"
                      className="grow"
                      placeholder="Latitude"
                      value={location.lat}
                      onChange={(e) => {
                        setLocation({
                          ...location,
                          lat: Number(e.target.value),
                        });
                      }}
                    />
                  </label>
                  <label className="input input-bordered flex w-full items-center gap-2">
                    <input
                      type="text"
                      className="grow"
                      placeholder="Longitude"
                      value={location.long}
                      onChange={(e) => {
                        setLocation({
                          ...location,
                          long: Number(e.target.value),
                        });
                      }}
                    />
                  </label>
                </div>
                <button
                  className="btn btn-primary w-full"
                  onClick={() => {
                    fetch("/api/cars", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        MMY: mmy,
                        licenceNumber: licence,
                        rentRate: Number(rate),
                        fuelType: fuel,
                        rating: 0,
                        location: `${location.lat}, ${location.long}`,
                      }),
                    }).then((res) => {
                      console.log(res);
                      toast("Car added successfully");
                      router.push("/rent");
                    });
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr className=" bg-base-200">
                <th>ID</th>
                <th>Model Make and Year</th>
                <th>License</th>
                <th>Fuel</th>
                <th>Status</th>
                <th className="text-right px-8">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car, index) => {
                return (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{car.MMY}</td>
                    <td>{car.licenceNumber}</td>
                    <td>{car.fuelType}</td>
                    <td>{car.customerId ? "Rented" : "Free"}</td>
                    <td className="flex justify-end gap-2">
                      <button
                        className="btn w-20"
                        onClick={() => {
                          fetch("/api/cars", {
                            method: "DELETE",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              id: car.id,
                            }),
                          }).then((res) => {
                            console.log(res);
                            setCars(cars.filter((c) => c.id !== car.id));
                          });
                          toast(`Deleted ${car.MMY} `);
                        }}
                      >
                        <Trash className="text-red-800" />
                      </button>
                      <button
                        className="btn"
                        onClick={() =>
                          document.getElementById("my_modal_2")?.showModal()
                        }
                      >
                        <UploadCloud className="text-green-800" />
                      </button>
                      <dialog id="my_modal_2" className="modal">
                        <div className="modal-box">
                          <h3 className="font-bold text-lg">Update your car</h3>
                          <label className="input input-bordered flex items-center gap-2">
                            <input
                              type="text"
                              className="grow"
                              placeholder="Model Make and Year"
                            />
                          </label>
                          <label className="input input-bordered flex items-center gap-2">
                            <input
                              type="text"
                              className="grow"
                              placeholder="Licence"
                            />
                          </label>
                          <label className="input input-bordered flex items-center gap-2">
                            <input
                              type="text"
                              className="grow"
                              placeholder="Fuel Type"
                            />
                          </label>
                          <label className="input input-bordered flex items-center gap-2">
                            <input
                              type="text"
                              className="grow"
                              placeholder="Rate"
                            />
                          </label>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                          <button>confirm</button>
                        </form>
                      </dialog>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
