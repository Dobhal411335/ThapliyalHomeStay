'use client'

import { usePackage } from "@/components/admin/context/PackageContext";
import { useForm } from "react-hook-form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { statesIndia } from "@/lib/IndiaStates"
import toast from "react-hot-toast"
import { Input } from "@/components/ui/input"
import { NumericFormat } from "react-number-format"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"


const AddVehicle = () => {
  const { handleSubmit, register, getValues, setValue, reset, watch } = useForm({
    defaultValues: {
      vehiclePlan: {
        vehicleName1: "",
        vehicleName2: "",
        vehicleName3: "",
        vehiclePrice1: 0,
        vehiclePrice2: 0,
        vehiclePrice3: 0,
        pickup: {
          state: "",
          city: "",
          price1: 0,
          price2: 0,
          price3: 0,
        },
        drop: {
          state: "",
          city: "",
          price1: 0,
          price2: 0,
          price3: 0,
        },
      },
    },
  });

  const dropState = watch("vehiclePlan.drop.state");
  const dropCity = watch("vehiclePlan.drop.city");
  const pickupState = watch("vehiclePlan.pickup.state");
  const pickupCity = watch("vehiclePlan.pickup.city");

  const packages = usePackage()
  const [selectedPickupState, setSelectedPickupState] = useState("");
  const [selectedDropState, setSelectedDropState] = useState("");
  const [selectedPickupCity, setSelectedPickupCity] = useState("");
  const [selectedDropCity, setSelectedDropCity] = useState("");
  const [cities, setCities] = useState([]);

  const [selectedPickupOptions, setSelectedPickupOptions] = useState([]);
  const [selectedDropOptions, setSelectedDropOptions] = useState([]);

  const handlePickupCheckboxChange = (value) => {
    setSelectedPickupOptions((prev) =>
      prev.includes(value)
        ? prev.filter((option) => option !== value)
        : [...prev, value]
    );
  };
  const handleDropCheckboxChange = (value) => {
    setSelectedDropOptions((prev) =>
      prev.includes(value)
        ? prev.filter((option) => option !== value)
        : [...prev, value]
    );
  };

  useEffect(() => {
    if (packages) {
      Object.entries(packages.vehiclePlan).forEach(([key, value]) => {
        setValue(`vehiclePlan.${key}`, value);
      });

      // Ensure state is updated
      setSelectedPickupState(packages?.vehiclePlan?.pickup?.state || "");
      setSelectedDropState(packages?.vehiclePlan?.drop?.state || "");
      setSelectedPickupOptions(packages?.vehiclePlan?.pickup?.vehicleType || []);
      setSelectedDropOptions(packages?.vehiclePlan?.drop?.vehicleType || []);
    }
  }, [packages]);

  // Ensure selected state is updated when form value changes
  useEffect(() => {
    if (pickupState) setSelectedPickupState(pickupState);
  }, [pickupState]);

  useEffect(() => {
    if (dropState) setSelectedDropState(dropState);
  }, [dropState]);

  useEffect(() => {
    if (pickupCity) setSelectedPickupCity(pickupCity);
  }, [pickupCity]);

  useEffect(() => {
    if (dropCity) setSelectedDropCity(dropCity);
  }, [dropCity]);

  // Fetch cities from API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("/api/admin/website-manage/addCityName");
        const res = await response.json();
        if (response.ok) {
          setCities(res.cities);
        } else {
          toast.error(res.message, {
            style: { borderRadius: "10px", border: "2px solid red" },
          });
        }
      } catch (error) {
        toast.error("Failed to fetch cities", {
          style: { borderRadius: "10px", border: "2px solid red" },
        });
      }
    };

    fetchCities();
  }, []);

  const onSubmit = async (data) => {
    data.pkgId = packages._id
    data.vehiclePlan.pickup.vehicleType = selectedPickupOptions;
    data.vehiclePlan.drop.vehicleType = selectedDropOptions;
    data.vehiclePlan.pickup.state = selectedPickupState;
    data.vehiclePlan.pickup.city = selectedPickupCity;
    data.vehiclePlan.drop.state = selectedDropState;
    data.vehiclePlan.drop.city = selectedDropCity;

    if (data.vehiclePlan.vehicleName1 === "" || data.vehiclePlan.vehicleName2 === "" || data.vehiclePlan.vehicleName3 === "") {
      toast.error("Vehicle Name is required", {
        style: {
          border: "2px solid red",
          borderRadius: "10px",
        }
      })
      return
    }
    if (data.vehiclePlan.vehiclePrice1 === 0 || data.vehiclePlan.vehiclePrice2 === 0 || data.vehiclePlan.vehiclePrice3 === 0) {
      toast.error("Vehicle Price is required", {
        style: {
          border: "2px solid red",
          borderRadius: "10px",
        }
      })
      return
    }
    if (selectedPickupState === '' || selectedPickupCity === '') {
      toast.error("Pickup State/City is required", {
        style: {
          border: "2px solid red",
          borderRadius: "10px",
        }
      })
      return
    }
    if (data.vehiclePlan.pickup.price1 === 0 || data.vehiclePlan.pickup.price2 === 0 || data.vehiclePlan.pickup.price3 === 0) {
      toast.error("Pickup Price is required", {
        style: {
          border: "2px solid red",
          borderRadius: "10px",
        }
      })
      return
    }
    if (selectedDropState === '' || selectedDropCity === '') {
      toast.error("Drop State/City is required", {
        style: {
          border: "2px solid red",
          borderRadius: "10px",
        }
      })
      return
    }
    if (data.vehiclePlan.drop.price1 === 0 || data.vehiclePlan.drop.price2 === 0 || data.vehiclePlan.drop.price3 === 0) {
      toast.error("Drop Price is required", {
        style: {
          border: "2px solid red",
          borderRadius: "10px",
        }
      })
      return
    }

    try {
      const response = await fetch("/api/admin/website-manage/addPackage/addVehicle", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      const res = await response.json()
      if (response.ok) {
        toast.success(res.message, {
          style: {
            border: "2px solid green",
            borderRadius: "10px",
          }
        })
        window.location.reload();
      } else {
        toast.error(res.message, {
          style: {
            border: "2px solid red",
            borderRadius: "10px",
          }
        })
      }
    } catch (error) {
      toast.error("Something went wrong, Please try again", {
        style: {
          border: "2px solid red",
          borderRadius: "10px",
        }
      })
    }

  }

  return (
    <>
      <form className="flex w-full max-w-full flex-col gap-8 overflow-x-auto rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-border/50 md:p-8 lg:overflow-visible" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="font-heading text-3xl text-heading md:text-4xl">Add Vehicle Plan</h1>
        <Table className="w-full min-w-max lg:min-w-0">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center text-heading">Category</TableHead>
              <TableHead className="text-heading text-center">Vehicle Name</TableHead>
              <TableHead className="text-heading text-center">Fix Vehicle Price (For Entire Trip)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="border font-semibold border-warning/40 bg-warning/20 w-1/3">Category 1 (2-4 People)</TableCell>
              <TableCell className="border font-semibold border-border w-1/3">
                <Input type="text"  {...register("vehiclePlan.vehicleName1")} />
              </TableCell>
              <TableCell className="border font-semibold border-border w-1/3">
                <NumericFormat thousandSeparator=","
                  decimalSeparator="."
                  prefix="₹ "
                  value={watch("vehiclePlan.vehiclePrice1")}
                  onValueChange={(values) => setValue("vehiclePlan.vehiclePrice1", values.floatValue)} className="h-8 w-full rounded-[var(--radius-input)] border border-border bg-transparent px-2.5 py-1 text-sm outline-none focus:border-primary" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border font-semibold border-primary/40 bg-primary/15 w-1/3">Category 2 (5-7 People)</TableCell>
              <TableCell className="border font-semibold border-border w-1/3">
                <Input type="text" {...register("vehiclePlan.vehicleName2")} />
              </TableCell>
              <TableCell className="border font-semibold border-border w-1/3">
                <NumericFormat thousandSeparator=","
                  decimalSeparator="."
                  prefix="₹ "
                  value={watch("vehiclePlan.vehiclePrice2")}
                  onValueChange={(values) => setValue("vehiclePlan.vehiclePrice2", values.floatValue)} className="h-8 w-full rounded-[var(--radius-input)] border border-border bg-transparent px-2.5 py-1 text-sm outline-none focus:border-primary" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border font-semibold border-warning/50 bg-warning/25 w-1/3">Category 3 (8 and Above People)</TableCell>
              <TableCell className="border font-semibold border-border w-1/3">
                <Input type="text" {...register("vehiclePlan.vehicleName3")} />
              </TableCell>
              <TableCell className="border font-semibold border-border w-1/3">
                <NumericFormat thousandSeparator=","
                  decimalSeparator="."
                  prefix="₹ "
                  value={watch("vehiclePlan.vehiclePrice3")}
                  onValueChange={(values) => setValue("vehiclePlan.vehiclePrice3", values.floatValue)} className="h-8 w-full rounded-[var(--radius-input)] border border-border bg-transparent px-2.5 py-1 text-sm outline-none focus:border-primary" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <h1 className="font-heading text-3xl text-heading md:text-4xl mt-12">Pickup & Drop</h1>
        <Table className="w-full min-w-max lg:min-w-0">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center text-heading border font-semibold border-border bg-white w-1/4">State/City</TableHead>
              <TableHead className="text-heading text-center border font-semibold border-warning/40 bg-warning/20 w-1/4">Cat-1 Price</TableHead>
              <TableHead className="text-heading text-center border font-semibold border-primary/40 bg-primary/15 w-1/4">Cat-2 Price</TableHead>
              <TableHead className="text-heading text-center border font-semibold border-warning/50 bg-warning/25 w-1/4">Cat-3 Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="border-l font-semibold border-border flex flex-col items-center gap-4">
                <Label>Pickup</Label>
                <div className="flex gap-4">
                  <Select
                    name="state"
                    className="p-2 border border-border rounded-md"
                    value={selectedPickupState}
                    onValueChange={(value) => { setValue(`vehiclePlan.pickup.state`, value); setSelectedPickupState(value) }}
                  >
                    <SelectTrigger className="border-2 bg-transparent border-border focus:border-border focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 w-52">
                      <SelectValue placeholder="Select State" className="truncate" />
                    </SelectTrigger>
                    <SelectContent className="border border-border font-body bg-white">
                      <SelectGroup>
                        {statesIndia.sort().map((state, index) => (
                          <SelectItem
                            key={index}
                            className="focus:bg-primary/20 font-bold truncate"
                            value={state}
                          >
                            {state}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Select
                    name="city"
                    className="p-2 border border-border rounded-md"
                    value={selectedPickupCity}
                    onValueChange={(value) => setValue(`vehiclePlan.pickup.city`, value)}
                  >
                    <SelectTrigger className="border-2 bg-transparent border-border focus:border-border focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 w-52">
                      <SelectValue placeholder="Select City for Pickup" className="truncate" />
                    </SelectTrigger>
                    <SelectContent className="border border-border font-body bg-white">
                      <SelectGroup>
                        {cities
                          .filter(cityGroup => cityGroup.stateName === selectedPickupState)
                          .flatMap(cityGroup => cityGroup.cities.map((city, index) => (
                            <SelectItem
                              key={index}
                              className="focus:bg-primary/20 font-bold truncate"
                              value={city}
                            >
                              {city}
                            </SelectItem>
                          )))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </TableCell>
              <TableCell className="border font-semibold border-border w-1/4">
                <NumericFormat thousandSeparator=","
                  decimalSeparator="."
                  prefix="₹ "
                  value={watch("vehiclePlan.pickup.price1")}
                  onValueChange={(values) => setValue("vehiclePlan.pickup.price1", values.floatValue)} className="h-8 w-full rounded-[var(--radius-input)] border border-border bg-transparent px-2.5 py-1 text-sm outline-none focus:border-primary" />
              </TableCell>
              <TableCell className="border font-semibold border-border w-1/4">
                <NumericFormat thousandSeparator=","
                  decimalSeparator="."
                  prefix="₹ "
                  value={watch("vehiclePlan.pickup.price2")}
                  onValueChange={(values) => setValue("vehiclePlan.pickup.price2", values.floatValue)} className="h-8 w-full rounded-[var(--radius-input)] border border-border bg-transparent px-2.5 py-1 text-sm outline-none focus:border-primary" />
              </TableCell>
              <TableCell className="border font-semibold border-border w-1/4">
                <NumericFormat thousandSeparator=","
                  decimalSeparator="."
                  prefix="₹ "
                  value={watch("vehiclePlan.pickup.price3")}
                  onValueChange={(values) => setValue("vehiclePlan.pickup.price3", values.floatValue)} className="h-8 w-full rounded-[var(--radius-input)] border border-border bg-transparent px-2.5 py-1 text-sm outline-none focus:border-primary" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4} className="border font-semibold border-border w-1/4">
                <div className="flex items-center justify-center gap-8 my-2">
                  <div className="flex items-center space-x-2 border border-border bg-primary/20 p-2 rounded-full">
                    <Checkbox
                      id="pickupRailwayStation"
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-border"
                      checked={selectedPickupOptions.includes("Railway Station")}
                      onCheckedChange={() => handlePickupCheckboxChange("Railway Station")}
                    />
                    <label htmlFor="pickupRailwayStation" className="text-sm font-medium leading-none">
                      Railway Station
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 border border-border bg-primary/20 p-2 rounded-full">
                    <Checkbox
                      id="pickupBusStand"
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-border"
                      checked={selectedPickupOptions.includes("Bus Stand")}
                      onCheckedChange={() => handlePickupCheckboxChange("Bus Stand")}
                    />
                    <label htmlFor="pickupBusStand" className="text-sm font-medium leading-none">
                      Bus Stand
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 border border-border bg-primary/20 p-2 rounded-full">
                    <Checkbox
                      id="pickupAirport"
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-border"
                      checked={selectedPickupOptions.includes("Airport")}
                      onCheckedChange={() => handlePickupCheckboxChange("Airport")}
                    />
                    <label htmlFor="pickupAirport" className="text-sm font-medium leading-none">
                      Airport
                    </label>
                  </div>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border-l font-semibold border-border flex flex-col items-center gap-4">
                <Label>Drop</Label>
                <div className="flex gap-4">
                  <Select
                    name="state"
                    className="p-2 border border-border rounded-md"
                    value={selectedDropState}
                    onValueChange={(value) => { setValue(`vehiclePlan.drop.state`, value); setSelectedDropState(value) }}
                  >
                    <SelectTrigger className="border-2 bg-transparent border-border focus:border-border focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 w-52">
                      <SelectValue placeholder="Select State" className="truncate" />
                    </SelectTrigger>
                    <SelectContent className="border border-border font-body bg-white">
                      <SelectGroup>
                        {statesIndia.sort().map((state, index) => (
                          <SelectItem
                            key={index}
                            className="focus:bg-primary/20 font-bold truncate"
                            value={state}
                          >
                            {state}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Select
                    name="city"
                    className="p-2 border border-border rounded-md"
                    value={selectedDropCity}
                    onValueChange={(value) => setValue(`vehiclePlan.drop.city`, value)}
                  >
                    <SelectTrigger className="border-2 bg-transparent border-border focus:border-border focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 w-52">
                      <SelectValue placeholder="Select City for Drop" className="truncate" />
                    </SelectTrigger>
                    <SelectContent className="border border-border font-body bg-white">
                      <SelectGroup>
                        {cities
                          .filter(cityGroup => cityGroup.stateName === selectedDropState)
                          .flatMap(cityGroup => cityGroup.cities.map((city, index) => (
                            <SelectItem
                              key={index}
                              className="focus:bg-primary/20 font-bold truncate"
                              value={city}
                            >
                              {city}
                            </SelectItem>
                          )))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </TableCell>
              <TableCell className="border font-semibold border-border w-1/4">
                <NumericFormat thousandSeparator=","
                  decimalSeparator="."
                  prefix="₹ "
                  value={watch("vehiclePlan.drop.price1")}
                  onValueChange={(values) => setValue("vehiclePlan.drop.price1", values.floatValue)} className="h-8 w-full rounded-[var(--radius-input)] border border-border bg-transparent px-2.5 py-1 text-sm outline-none focus:border-primary" />
              </TableCell>
              <TableCell className="border font-semibold border-border w-1/4">
                <NumericFormat thousandSeparator=","
                  decimalSeparator="."
                  prefix="₹ "
                  value={watch("vehiclePlan.drop.price2")}
                  onValueChange={(values) => setValue("vehiclePlan.drop.price2", values.floatValue)} className="h-8 w-full rounded-[var(--radius-input)] border border-border bg-transparent px-2.5 py-1 text-sm outline-none focus:border-primary" />
              </TableCell>
              <TableCell className="border font-semibold border-border w-1/4">
                <NumericFormat thousandSeparator=","
                  decimalSeparator="."
                  prefix="₹ "
                  value={watch("vehiclePlan.drop.price3")}
                  onValueChange={(values) => setValue("vehiclePlan.drop.price3", values.floatValue)} className="h-8 w-full rounded-[var(--radius-input)] border border-border bg-transparent px-2.5 py-1 text-sm outline-none focus:border-primary" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4} className="border font-semibold border-border w-1/4">
                <div className="flex items-center justify-center gap-8 my-2">
                  <div className="flex items-center space-x-2 border border-border bg-primary/20 p-2 rounded-full">
                    <Checkbox
                      id="dropRailwayStation"
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-border"
                      checked={selectedDropOptions.includes("Railway Station")}
                      onCheckedChange={() => handleDropCheckboxChange("Railway Station")}
                    />
                    <label htmlFor="dropRailwayStation" className="text-sm font-medium leading-none">
                      Railway Station
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 border border-border bg-primary/20 p-2 rounded-full">
                    <Checkbox
                      id="dropBusStand"
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-border"
                      checked={selectedDropOptions.includes("Bus Stand")}
                      onCheckedChange={() => handleDropCheckboxChange("Bus Stand")}
                    />
                    <label htmlFor="dropBusStand" className="text-sm font-medium leading-none">
                      Bus Stand
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 border border-border bg-primary/20 p-2 rounded-full">
                    <Checkbox
                      id="dropAirport"
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-border"
                      checked={selectedDropOptions.includes("Airport")}
                      onCheckedChange={() => handleDropCheckboxChange("Airport")}
                    />
                    <label htmlFor="dropAirport" className="text-sm font-medium leading-none">
                      Airport
                    </label>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Button type="submit">Save</Button>
      </form>
    </>
  )
}

export default AddVehicle
