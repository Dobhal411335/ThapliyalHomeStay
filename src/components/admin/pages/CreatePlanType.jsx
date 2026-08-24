'use client'

import { usePackage } from "@/components/admin/context/PackageContext";
import { useForm } from "react-hook-form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { statesIndia } from "@/lib/IndiaStates"
import toast from "react-hot-toast"
import React, { useEffect, useState } from "react"
import { NumericFormat } from 'react-number-format';
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const CreatePlanType = () => {
    const { handleSubmit, register, getValues, setValue, reset, watch } = useForm()
    const packages = usePackage()

    const [plans, setPlans] = useState([]);
    const [cities, setCities] = useState([])
    const [selectedStates, setSelectedStates] = useState({});
    const [activeTab, setActiveTab] = useState('createPlan');
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedPlan, setSelectedPlan] = useState(plans?.[0]?.planName);

    const handleStateChange = (value, title) => {
        setValue(`state-${title}`, value);
        setSelectedStates(prev => ({ ...prev, [title]: value }));
    };

    useEffect(() => {
        const fetchCities = async () => {
            const getCities = await fetch('/api/admin/website-manage/addCityName')
            const res = await getCities.json()
            setCities(res.cities)
        }
        fetchCities()
    }, [])

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await fetch("/api/admin/website-manage/addPlanType");
                const res = await response.json();
                if (response.ok) {
                    setPlans(res);
                    // Set the default plan to the first plan in the array
                    if (res.length > 0) {
                        setSelectedPlan(res[0].planName);
                    }
                } else {
                    toast.error(res.message, {
                        style: { borderRadius: "10px", border: "2px solid red" }
                    });
                }
            } catch (error) {
                toast.error("Failed to fetch plans", {
                    style: { borderRadius: "10px", border: "2px solid red" }
                });
            }
        };
        fetchPlans();
    }, []);

    useEffect(() => {
        if (selectedPlan && selectedCity) {
            const plan = plans.find(plan => plan.planName === selectedPlan);
            if (plan) {
                const cityData = plan.cities.find(city => city.city === selectedCity);
                if (cityData) {
                    // If data exists for the selected city and plan, populate the form fields
                    setValue("planName", plan.planName);
                    setValue("hotelName", cityData.hotelName);
                    setValue("adultPlan", cityData.adultPlan);
                    setValue("childPlan", cityData.childPlan);
                } else {
                    // Reset fields if no data is found
                    setValue("hotelName", "");
                    setValue("adultPlan", {
                        ep: { wem: { price: 0, margin: 0 }, em: { price: 0, margin: 0 } },
                        cp: { wem: { price: 0, margin: 0 }, em: { price: 0, margin: 0 } },
                        map: { wem: { price: 0, margin: 0 }, em: { price: 0, margin: 0 } },
                        ap: { wem: { price: 0, margin: 0 }, em: { price: 0, margin: 0 } },
                    });
                    setValue("childPlan", {
                        ep: { wem: { price: 0, margin: 0 } },
                        cp: { wem: { price: 0, margin: 0 } },
                        map: { wem: { price: 0, margin: 0 } },
                        ap: { wem: { price: 0, margin: 0 } },
                    });
                }
            } else {
                // Reset fields if no plan is found
                setValue("hotelName", "");
                setValue("adultPlan", {
                    ep: { wem: { price: 0, margin: 0 }, em: { price: 0, margin: 0 } },
                    cp: { wem: { price: 0, margin: 0 }, em: { price: 0, margin: 0 } },
                    map: { wem: { price: 0, margin: 0 }, em: { price: 0, margin: 0 } },
                    ap: { wem: { price: 0, margin: 0 }, em: { price: 0, margin: 0 } },
                });
                setValue("childPlan", {
                    ep: { wem: { price: 0, margin: 0 } },
                    cp: { wem: { price: 0, margin: 0 } },
                    map: { wem: { price: 0, margin: 0 } },
                    ap: { wem: { price: 0, margin: 0 } },
                });
            }
        }
    }, [selectedPlan, selectedCity, plans, setValue]);

    const onSubmit = async (data) => {

        const formattedData = packages.info
            .filter((info) => info.typeOfSelection === "Day Plan")
            .map((info) => ({
                day: info.selectionTitle,
                state: data[`state-${info.selectionTitle}`] || "",
                city: data[`city-${info.selectionTitle}`] || "",
            }));

        try {
            const response = await fetch("/api/admin/website-manage/addPackage/addPlanType", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pkgId: packages._id,
                    createPlanType: formattedData,
                }),
            });

            if (response.ok) {
                toast.success("Plan type created successfully!", { style: { borderRadius: "10px", border: "2px solid green" } });
                window.location.reload()
            } else {
                toast.error("Failed to create plan type", { style: { borderRadius: "10px", border: "2px solid red" } });
            }
        } catch (error) {
            toast.error("Something went wrong", { style: { borderRadius: "10px", border: "2px solid red" } });
        }
    }

    return (
        <div className="flex w-full max-w-full flex-col gap-6 rounded-[var(--radius-card)] bg-white p-6 font-body ring-1 ring-border/50 md:p-8">
            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => setActiveTab('createPlan')}
                    className={`rounded-[var(--radius-button)] border px-4 py-2 font-ui text-sm font-medium transition-colors ${activeTab === 'createPlan' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-surface text-heading hover:bg-background'}`}
                >
                    Create Plan
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('planReview')}
                    className={`rounded-[var(--radius-button)] border px-4 py-2 font-ui text-sm font-medium transition-colors ${activeTab === 'planReview' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-surface text-heading hover:bg-background'} ${packages?.basicDetails?.planCalculator !== "No" ? '' : 'hidden'}`}
                >
                    Plan Review
                </button>
            </div>

            {activeTab === 'createPlan' && (
                <form className="flex flex-col items-center gap-8 my-12 w-full" onSubmit={handleSubmit(onSubmit)}>
                    <h1 className="font-heading text-3xl text-heading md:text-4xl">Create Plan Type</h1>

                    {packages?.basicDetails?.planCalculator !== "No" ? (
                        <>
                            <div className="w-full overflow-x-auto lg:overflow-visible">
                                <Table className="w-full min-w-max lg:min-w-0">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-center text-heading">Day</TableHead>
                                            <TableHead className="text-center text-heading">Selected City</TableHead>
                                            <TableHead className="text-heading text-center">State</TableHead>
                                            <TableHead className="text-heading text-center">City</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {packages.info
                                            .filter((infoGroup) => infoGroup.typeOfSelection === "Day Plan")
                                            .map((info) => {
                                                const savedPlan = packages?.createPlanType?.find(plan => plan.day === info.selectionTitle);
                                                const savedState = savedPlan?.state || "";
                                                const savedCity = savedPlan?.city || "";

                                                return (
                                                    <TableRow key={info._id}>
                                                        <TableCell className="border font-semibold border-border">{info.selectionTitle}</TableCell>
                                                        <TableCell className="border font-semibold border-border">
                                                            <p className="text-center text-muted">
                                                                {savedCity || "City Not Selected"}
                                                            </p>
                                                        </TableCell>
                                                        <TableCell className="border font-semibold border-border w-52">
                                                            <Select
                                                                name="state"
                                                                className="p-2 border border-border rounded-md"
                                                                onValueChange={(value) => handleStateChange(value, info.selectionTitle)}
                                                                defaultValue={savedState}
                                                            >
                                                                <SelectTrigger className="border-2 bg-transparent border-border focus:border-border focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 w-52">
                                                                    <SelectValue placeholder="Select State" />
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
                                                        </TableCell>
                                                        <TableCell className="border font-semibold border-border w-52">
                                                            <Select
                                                                name="city"
                                                                className="p-2 border border-border rounded-md"
                                                                onValueChange={(value) => setValue(`city-${info.selectionTitle}`, value)}
                                                                defaultValue={savedCity}
                                                            >
                                                                <SelectTrigger className="border-2 bg-transparent border-border focus:border-border focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0">
                                                                    <SelectValue placeholder="Select City" />
                                                                </SelectTrigger>
                                                                <SelectContent className="border border-border bg-white font-body">
                                                                    <SelectGroup>
                                                                        {cities
                                                                            .filter(cityGroup => cityGroup.stateName === (selectedStates[info.selectionTitle] || savedState))
                                                                            .flatMap(cityGroup => cityGroup.cities.map((city) => (
                                                                                <SelectItem
                                                                                    key={`${selectedStates[info.selectionTitle] || savedState}-${city}`}
                                                                                    className="focus:bg-primary/20 font-bold truncate"
                                                                                    value={city}
                                                                                >
                                                                                    {city}
                                                                                </SelectItem>
                                                                            )))
                                                                        }
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            </div>
                            <Button type="submit">Save</Button>
                        </>
                    ) : (
                        <div className="rounded-[var(--radius-card)] border border-error/30 bg-error/10 px-6 py-4 text-center">
                            <p className="font-heading text-xl text-error md:text-2xl">
                                Plan Calculator is disabled
                            </p>
                        </div>
                    )}
                </form>
            )}


            {activeTab === 'planReview' && (
                <>
                    <h1 className="my-8 text-center font-heading text-3xl text-heading md:text-4xl">Plan Review</h1>
                    <div className="flex flex-col gap-2 w-52">
                        <Label>Select Plan Type</Label>
                        <Select onValueChange={setSelectedPlan} value={selectedPlan}>
                            <SelectTrigger className="border border-border focus:border-border focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0">
                                <SelectValue placeholder="Select Plan" />
                            </SelectTrigger>
                            <SelectContent className="border border-border font-body">
                                <SelectGroup>
                                    {plans.map((item) => (
                                        <SelectItem className="focus:bg-white" key={item._id} value={item.planName}>
                                            {item.planName}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full overflow-x-auto lg:overflow-visible bg-white p-4 rounded-[var(--radius-card)]">
                        <Table className="w-full min-w-max lg:min-w-0 mt-10">
                            {/* Adult Plan Table */}
                            <TableHeader>
                                <TableRow>
                                    <TableHead colSpan={9} className="text-center bg-primary/40 text-heading py-2 text-lg border border-border align-middle">
                                        ADULT PLAN
                                    </TableHead>
                                </TableRow>
                                <TableRow>
                                    <TableHead rowSpan={2} className="w-32 text-center bg-primary-hover text-white border border-border align-middle">
                                        PAX
                                    </TableHead>
                                    <TableHead colSpan={2} className="text-center bg-error/15 border border-error/50 text-heading">
                                        EP
                                    </TableHead>
                                    <TableHead colSpan={2} className="text-center bg-warning/20 border border-warning/50 text-heading">
                                        CP
                                    </TableHead>
                                    <TableHead colSpan={2} className="text-center bg-warning/25 border border-warning/60 text-heading">
                                        MAP
                                    </TableHead>
                                    <TableHead colSpan={2} className="text-center bg-primary/15 border border-primary/50 text-heading">
                                        AP
                                    </TableHead>
                                </TableRow>
                                <TableRow>
                                    <TableHead className="text-center bg-primary-hover text-white border border-border">
                                        Price
                                    </TableHead>
                                    <TableHead className="text-center bg-primary-hover text-white border border-border">
                                        Margin %
                                    </TableHead>
                                    <TableHead className="text-center bg-primary-hover text-white border border-border">
                                        Price
                                    </TableHead>
                                    <TableHead className="text-center bg-primary-hover text-white border border-border">
                                        Margin %
                                    </TableHead>
                                    <TableHead className="text-center bg-primary-hover text-white border border-border">
                                        Price
                                    </TableHead>
                                    <TableHead className="text-center bg-primary-hover text-white border border-border">
                                        Margin %
                                    </TableHead>
                                    <TableHead className="text-center bg-primary-hover text-white border border-border">
                                        Price
                                    </TableHead>
                                    <TableHead className="text-center bg-primary-hover text-white border border-border">
                                        Margin %
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {packages.createPlanType?.map((dayPlan, index) => {
                                    const city = dayPlan.city;
                                    const day = dayPlan.day;

                                    // Find the corresponding plan data for the selected plan and city
                                    const selectedPlanData = plans.find(plan => plan.planName === selectedPlan);
                                    const cityData = selectedPlanData?.cities.find(c => c.city === city);

                                    // Default values if no plan data is found
                                    const defaultAdultPlan = {
                                        ep: { wem: { price: 0, margin: 0 }, em: { price: 0, margin: 0 } },
                                        cp: { wem: { price: 0, margin: 0 }, em: { price: 0, margin: 0 } },
                                        map: { wem: { price: 0, margin: 0 }, em: { price: 0, margin: 0 } },
                                        ap: { wem: { price: 0, margin: 0 }, em: { price: 0, margin: 0 } },
                                    };

                                    const adultPlan = cityData?.adultPlan || defaultAdultPlan;
                                    const peopleGroups = [2, 4, 6, 8]

                                    return (
                                        <React.Fragment key={index}>
                                            <TableRow>
                                                <TableCell colSpan={9} className="w-full border border-border text-center">
                                                    <p className="w-fit mx-auto border border-border bg-primary/20 text-lg p-2 rounded-full">{day} - {city}</p>
                                                </TableCell>
                                            </TableRow>
                                            {peopleGroups.map((pax) => (
                                                <React.Fragment key={pax}>
                                                    <TableRow>
                                                        <TableCell className="border font-semibold border-border text-center align-middle">
                                                            {pax}
                                                        </TableCell>
                                                        <TableCell className="border border-border">
                                                            <NumericFormat
                                                                thousandSeparator=","
                                                                prefix="₹ "
                                                                type="text"
                                                                className="py-1.5 bg-transparent w-full text-center border rounded-md p-1 font-bold border-border"
                                                                value={(adultPlan.ep.wem.price * (pax / 2)) || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                        <TableCell className="border border-border">
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                min={0}
                                                                className="w-full text-center border rounded-md p-1 font-bold border-border"
                                                                value={adultPlan.ep.wem.margin || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                        <TableCell className="border border-border">
                                                            <NumericFormat
                                                                thousandSeparator=","
                                                                prefix="₹ "
                                                                type="text"
                                                                className="py-1.5 bg-transparent w-full text-center border rounded-md p-1 font-bold border-border"
                                                                value={(adultPlan.cp.wem.price * (pax / 2)) || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                        <TableCell className="border border-border">
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                min={0}
                                                                className="w-full text-center border rounded-md p-1 font-bold border-border"
                                                                value={adultPlan.cp.wem.margin || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                        <TableCell className="border border-border">
                                                            <NumericFormat
                                                                thousandSeparator=","
                                                                prefix="₹ "
                                                                type="text"
                                                                className="py-1.5 bg-transparent w-full text-center border rounded-md p-1 font-bold border-border"
                                                                value={(adultPlan.map.wem.price * (pax / 2)) || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                        <TableCell className="border border-border">
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                min={0}
                                                                className="w-full text-center border rounded-md p-1 font-bold border-border"
                                                                value={adultPlan.map.wem.margin || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                        <TableCell className="border border-border">
                                                            <NumericFormat
                                                                thousandSeparator=","
                                                                prefix="₹ "
                                                                type="text"
                                                                className="py-1.5 bg-transparent w-full text-center border rounded-md p-1 font-bold border-border"
                                                                value={(adultPlan.ap.wem.price * (pax / 2)) || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                        <TableCell className="border border-border">
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                min={0}
                                                                className="w-full text-center border rounded-md p-1 font-bold border-border"
                                                                value={adultPlan.ap.wem.margin || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="border font-semibold border-border text-center align-middle">
                                                            Extra Mattress
                                                        </TableCell>
                                                        <TableCell className="border border-border">
                                                            <NumericFormat
                                                                thousandSeparator=","
                                                                prefix="₹ "
                                                                type="text"
                                                                className="py-1.5 bg-transparent w-full text-center border rounded-md p-1 font-bold border-border"
                                                                value={adultPlan.ep.em.price || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                        <TableCell className="border border-border">
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                min={0}
                                                                className="w-full text-center border rounded-md p-1 font-bold border-border"
                                                                value={adultPlan.ep.em.margin || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                        <TableCell className="border border-border">
                                                            <NumericFormat
                                                                thousandSeparator=","
                                                                prefix="₹ "
                                                                type="text"
                                                                className="py-1.5 bg-transparent w-full text-center border rounded-md p-1 font-bold border-border"
                                                                value={adultPlan.cp.em.price || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                        <TableCell className="border border-border">
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                min={0}
                                                                className="w-full text-center border rounded-md p-1 font-bold border-border"
                                                                value={adultPlan.cp.em.margin || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                        <TableCell className="border border-border">
                                                            <NumericFormat
                                                                thousandSeparator=","
                                                                prefix="₹ "
                                                                type="text"
                                                                className="py-1.5 bg-transparent w-full text-center border rounded-md p-1 font-bold border-border"
                                                                value={adultPlan.map.em.price || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                        <TableCell className="border border-border">
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                min={0}
                                                                className="w-full text-center border rounded-md p-1 font-bold border-border"
                                                                value={adultPlan.map.em.margin || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                        <TableCell className="border border-border">
                                                            <NumericFormat
                                                                thousandSeparator=","
                                                                prefix="₹ "
                                                                type="text"
                                                                className="py-1.5 bg-transparent w-full text-center border rounded-md p-1 font-bold border-border"
                                                                value={adultPlan.ap.em.price || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                        <TableCell className="border border-border">
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                min={0}
                                                                className="w-full text-center border rounded-md p-1 font-bold border-border"
                                                                value={adultPlan.ap.em.margin || 0}
                                                                readOnly
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                </React.Fragment>
                                            ))}
                                        </React.Fragment>
                                    );
                                })}
                            </TableBody>
                        </Table>

                        <Table className="w-full min-w-max lg:min-w-0 mt-10">
                            {/* Child Plan Table */}
                            <TableHeader>
                                <TableRow>
                                    <TableHead colSpan={9} className="text-center bg-primary/40 text-heading py-2 text-lg border border-border align-middle">
                                        CHILD PLAN
                                    </TableHead>
                                </TableRow>
                                <TableRow>
                                    <TableHead rowSpan={2} className="w-32 text-center bg-primary-hover text-white border border-border align-middle">
                                        PAX
                                    </TableHead>
                                    <TableHead colSpan={2} className="text-center bg-error/15 border border-error/50 text-heading">
                                        EP
                                    </TableHead>
                                    <TableHead colSpan={2} className="text-center bg-warning/20 border border-warning/50 text-heading">
                                        CP
                                    </TableHead>
                                    <TableHead colSpan={2} className="text-center bg-warning/25 border border-warning/60 text-heading">
                                        MAP
                                    </TableHead>
                                    <TableHead colSpan={2} className="text-center bg-primary/15 border border-primary/50 text-heading">
                                        AP
                                    </TableHead>
                                </TableRow>
                                <TableRow>
                                    <TableHead className="text-center bg-primary-hover text-white border border-border">
                                        Price
                                    </TableHead>
                                    <TableHead className="text-center bg-primary-hover text-white border border-border">
                                        Margin %
                                    </TableHead>
                                    <TableHead className="text-center bg-primary-hover text-white border border-border">
                                        Price
                                    </TableHead>
                                    <TableHead className="text-center bg-primary-hover text-white border border-border">
                                        Margin %
                                    </TableHead>
                                    <TableHead className="text-center bg-primary-hover text-white border border-border">
                                        Price
                                    </TableHead>
                                    <TableHead className="text-center bg-primary-hover text-white border border-border">
                                        Margin %
                                    </TableHead>
                                    <TableHead className="text-center bg-primary-hover text-white border border-border">
                                        Price
                                    </TableHead>
                                    <TableHead className="text-center bg-primary-hover text-white border border-border">
                                        Margin %
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {packages.createPlanType?.map((dayPlan, index) => {
                                    const city = dayPlan.city;
                                    const day = dayPlan.day;

                                    // Find the corresponding plan data for the selected plan and city
                                    const selectedPlanData = plans.find(plan => plan.planName === selectedPlan);
                                    const cityData = selectedPlanData?.cities.find(c => c.city === city);

                                    // Default values if no plan data is found
                                    const defaultChildPlan = {
                                        ep: { wem: { price: 0, margin: 0 } },
                                        cp: { wem: { price: 0, margin: 0 } },
                                        map: { wem: { price: 0, margin: 0 } },
                                        ap: { wem: { price: 0, margin: 0 } },
                                    };

                                    const childPlan = cityData?.childPlan || defaultChildPlan;

                                    return (
                                        <React.Fragment key={index}>
                                            <TableRow>
                                                <TableCell colSpan={9} className="w-full border border-border text-center">
                                                    <p className="w-fit mx-auto border border-border bg-primary/20 text-lg p-2 rounded-full">{day} - {city}</p>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="border font-semibold border-border text-center align-middle">
                                                    1
                                                </TableCell>
                                                <TableCell className="border border-border">
                                                    <NumericFormat
                                                        thousandSeparator=","
                                                        prefix="₹ "
                                                        type="text"
                                                        className="py-1.5 bg-transparent w-full text-center border rounded-md p-1 font-bold border-border"
                                                        value={childPlan.ep.wem.price || 0}
                                                        readOnly
                                                    />
                                                </TableCell>
                                                <TableCell className="border border-border">
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min={0}
                                                        className="w-full text-center border rounded-md p-1 font-bold border-border"
                                                        value={childPlan.ep.wem.margin || 0}
                                                        readOnly
                                                    />
                                                </TableCell>
                                                <TableCell className="border border-border">
                                                    <NumericFormat
                                                        thousandSeparator=","
                                                        prefix="₹ "
                                                        type="text"
                                                        className="py-1.5 bg-transparent w-full text-center border rounded-md p-1 font-bold border-border"
                                                        value={childPlan.cp.wem.price || 0}
                                                        readOnly
                                                    />
                                                </TableCell>
                                                <TableCell className="border border-border">
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min={0}
                                                        className="w-full text-center border rounded-md p-1 font-bold border-border"
                                                        value={childPlan.cp.wem.margin || 0}
                                                        readOnly
                                                    />
                                                </TableCell>
                                                <TableCell className="border border-border">
                                                    <NumericFormat
                                                        thousandSeparator=","
                                                        prefix="₹ "
                                                        type="text"
                                                        className="py-1.5 bg-transparent w-full text-center border rounded-md p-1 font-bold border-border"
                                                        value={childPlan.map.wem.price || 0}
                                                        readOnly
                                                    />
                                                </TableCell>
                                                <TableCell className="border border-border">
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min={0}
                                                        className="w-full text-center border rounded-md p-1 font-bold border-border"
                                                        value={childPlan.map.wem.margin || 0}
                                                        readOnly
                                                    />
                                                </TableCell>
                                                <TableCell className="border border-border">
                                                    <NumericFormat
                                                        thousandSeparator=","
                                                        prefix="₹ "
                                                        type="text"
                                                        className="py-1.5 bg-transparent w-full text-center border rounded-md p-1 font-bold border-border"
                                                        value={childPlan.ap.wem.price || 0}
                                                        readOnly
                                                    />
                                                </TableCell>
                                                <TableCell className="border border-border">
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min={0}
                                                        className="w-full text-center border rounded-md p-1 font-bold border-border"
                                                        value={childPlan.ap.wem.margin || 0}
                                                        readOnly
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </>
            )}
        </div>
    )
}

export default CreatePlanType