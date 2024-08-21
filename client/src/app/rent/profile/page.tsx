"use client";

import Navbar from "@/app/components/Navbar";
import { Ratio } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CarList() {
  const [rents, setRents] = useState([]);
  const [cars, setCars] = useState<any>([]);

  const router = useRouter();
  useEffect(() => {
    fetch("/api/rent")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.body);
        setRents(data.body);
        data.body.forEach((rent) => {
          fetch(`/api/cars/${rent.carId}`)
            .then((res) => res.json())
            .then((data) =>
              setCars((car) => {
                car.push(data.MMY);
                return car;
              })
            );
        });
      });
    console.log("cars console log:", cars);
  }, []);
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-2">Your Rentals:</h1>
        <div className="flex flex-wrap gap-4">
          {rents.map((rent, i) => (
            <div className="bg-base-200 p-8 rounded-lg">
              <div className="text-2xl font-bold text-center">{cars[i]}</div>
              <div>
                <span className="font-bold">Start Date:</span>{" "}
                {new Date(rent.startDate).toLocaleDateString()}
              </div>
              <div>
                <span className="font-bold">End Date:</span>{" "}
                {new Date(rent.endDate).toLocaleDateString()}
              </div>
              {Date.now() < new Date(rent.endDate).getTime() && (
                <div className="flex gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      document.getElementById("my_modal_2")?.showModal()
                    }
                  >
                    End Ride
                  </button>
                  <dialog id="my_modal_2" className="modal">
                    <div className="modal-box">
                      <h3 className="font-bold text-lg">Rate!</h3>
                      <select
                        className="select select-primary w-full"
                        onChange={(e) => {
                          console.log(e.target.value);
                          fetch("/api/rate", {
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              carId: rent.carId,
                              rating: Number(e.target.value),
                            }),
                          })
                            .then((res) => {
                              return res.json();
                            })
                            .then((data) => {
                              console.log(data.body);
                            });
                          fetch("/api/rent", {
                            method: "DELETE",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              id: rent.id,
                            }),
                          });
                          router.push("/rent");
                        }}
                      >
                        <option disabled>How was your ride?</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </select>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                      <button>close</button>
                    </form>
                  </dialog>
                  <button
                    className="btn btn-warning"
                    onClick={() => {
                      setRents(rents.filter((rent) => rent.id !== rent.id));
                      fetch("/api/rent", {
                        method: "DELETE",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          id: rent.id,
                        }),
                      });
                    }}
                  >
                    Cancel booking
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      fetch("/api/rent", {
                        method: "PATCH",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          id: rent.id,
                          carId: rent.carId,
                          endDate: new Date(
                            new Date(rent.endDate).getTime() +
                              24 * 60 * 60 * 1000
                          ).toISOString(),
                        }),
                      })
                        .then((res) => res.json())
                        .then((data) => {
                          if (data.status === 400) {
                            toast(
                              "Cannot extend booking, that car has been booked for that day"
                            );
                          } else {
                            toast("Booking extended by 1 day");
                            window.location.reload();
                          }
                        });
                    }}
                  >
                    Extend booking by 1 day
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
