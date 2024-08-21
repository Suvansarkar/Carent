"use client";
import { useRouter } from "next/navigation";
import { Filter, Menu } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Image from "next/image";
import CarImage from "../images/car.jpeg";
import { useEffect, useState } from "react";

export default function Rent() {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();
  useEffect(() => {
    fetch("/api/cars")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.body);
        setCars(data.body);
        setFilteredCars(data.body);
      });
  }, []);

  const makes = [
    "Toyota",
    "Ford",
    "Tesla",
    "Mercedes",
    "Chevrolet",
    "Volkswagen",
    "BMW",
    "Honda",
  ];

  return (
    <>
      <Navbar />
      <div className="drawer fixed bottom-4 left-[90%] z-[99]">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label htmlFor="my-drawer" className="btn btn-primary drawer-button ">
            <Filter />
            Filters
          </label>
        </div>
        <div className="drawer-side z-[99]">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="menu bg-base-200 text-base-content min-h-full w-80 p-4 flex flex-col gap-4">
            <div className="text-xl font-bold mb-2">Filters </div>
            <select
              className="select select-bordered w-full max-w-xs"
              onChange={(e) => {
                setFilteredCars(() => {
                  if (e.target.value === "All cars") {
                    return cars;
                  }
                  return cars.filter((item) => {
                    const list = item.MMY.toLowerCase().includes(
                      e.target.value.toLowerCase()
                    );
                    console.log(list);
                    return list;
                  });
                });
              }}
            >
              <option selected>All cars</option>
              {makes.map((make) => {
                return <option>{make}</option>;
              })}
            </select>
            <select
              className="select select-bordered w-full max-w-xs"
              onChange={(e) => {
                setFilteredCars(() => {
                  if (e.target.value === "All fuel types") {
                    return cars;
                  }
                  return cars.filter((item) => {
                    const list = item.fuelType
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase());
                    console.log(list);
                    return list;
                  });
                });
              }}
            >
              <option selected>All fuel types</option>
              <option>Electric</option>
              <option>Diesel</option>
              <option>Petrol</option>
            </select>
          </div>
        </div>
      </div>
      <label className="input input-bordered items-center gap-2 flex justify-between w-[80%] mx-auto">
        <input
          type="text"
          className="w-[80%]"
          placeholder="Search"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setFilteredCars((data) => {
              return cars.filter((item) => {
                return (
                  item.MMY.toLowerCase().includes(
                    e.target.value.toLowerCase()
                  ) ||
                  item.licenceNumber
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
                );
              });
            });
          }}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      </label>
      <div>
        <div className="flex flex-wrap justify-around p-8 xl:px-32 gap-8">
          {filteredCars.map((car) => {
            return (
              <div className="card bg-base-200 w-96 shadow-xl">
                <figure>
                  <Image src={CarImage} alt={car.MMY} placeholder="blur" />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{car.MMY}</h2>
                  <p>Registration: {car.licenceNumber}</p>
                  <p>Pricing: Rs.{car.rentRate}/day</p>
                  <p>Fuel: {car.fuelType}</p>
                  <p>rating: {Math.round(car.rating * 100) / 100}</p>
                  <p>Location: {car.location}</p>
                  <div className="card-actions justify-end">
                    <button
                      className="btn btn-primary w-full text-xl"
                      onClick={() => {
                        router.push(`/rent/${car.id}`);
                      }}
                    >
                      Rent
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
