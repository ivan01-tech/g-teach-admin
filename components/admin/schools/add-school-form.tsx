"use client";

import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { GERMAN_LEVELS, EXAM_TYPES, SPECIALIZATIONS, City } from "@/lib/types";
import { Spinner } from "@/components/ui/spinner";
import { ChevronsUpDown, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { firebaseCollections } from "@/lib/collections";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAppSelector } from "@/lib/hooks";
import { db } from "@/lib/firebase";

export async function addCity(name: string): Promise<string> {
  const citiesRef = collection(db, firebaseCollections.cities);
  const docRef = await addDoc(citiesRef, {
    name,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
export default function AddSchoolForm({
  onCreate,
  onClose,
}: {
  onCreate: (s: any) => void;
  onClose: () => void;
}) {
  const [name, setName] = React.useState("");
  const [logo, setLogo] = React.useState("");
  const [city, setCity] = React.useState("");
  const [place, setPlace] = React.useState("");
  const [country, setCountry] = React.useState("Cameroon");
  const [exams, setExams] = React.useState<string[]>([]);
  const [levels, setLevels] = React.useState<string[]>([]);
  const [specializations, setSpecializations] = React.useState<string[]>([]);
  const [description, setDescription] = React.useState("");

  const [fetchingCities, setFetchingCities] = React.useState(false);
  const [fetchingPlaces, setFetchingPlaces] = React.useState(false);

  const [openCity, setOpenCity] = React.useState(false);
  const [openPlace, setOpenPlace] = React.useState(false);
  const [searchCity, setSearchCity] = React.useState("");
  const [searchPlace, setSearchPlace] = React.useState("");
  const { cities } = useAppSelector((s) => s.cities);

  const handleCreateCity = async (name: string) => {
    try {
      const cityId = await addCity(name);
      const newCity: City = { id: cityId, name };
      return newCity;
    } catch (error) {
      console.error("Error creating city:", error);
    }
  };

  const handleCreatePlace = (value: string) => {
    const item = { id: `p_${Date.now()}`, name: value };
    setPlace(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !city || !country) return;

    const newSchool = {
      id: `s_${Date.now()}`,
      name,
      logo: logo || "/logo-placeholder.png",
      location: { city, country, place },
      exams: exams,
      isVerified: false,
      rating: 0,
      reviewCount: 0,
      levels: levels,
      specializations: specializations,
      description,
      documents: [],
    };

    onCreate(newSchool);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium">Ajouter une école</div>
        <button
          type="button"
          className="text-sm text-muted-foreground"
          onClick={onClose}
        >
          Fermer
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="mb-1">Nom</Label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border px-2 py-1 bg-transparent"
          />
        </div>
        <div>
          <Label className="mb-1">Logo (URL)</Label>
          <input
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            className="mt-1 w-full rounded-md border px-2 py-1 bg-transparent"
          />
        </div>

        <div className="space-y-2 flex flex-col pt-1">
          <Label htmlFor="city" className="mb-1">
            Ville
          </Label>
          <Popover open={openCity} onOpenChange={setOpenCity}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openCity}
                className="w-full justify-between font-normal"
                disabled={fetchingCities}
              >
                {city || "Select a city..."}
                {fetchingCities ? (
                  <Spinner className="ml-2 h-4 w-4 opacity-50" />
                ) : (
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[--radix-popover-trigger-width] p-0"
              align="start"
            >
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search city..."
                  value={searchCity}
                  onValueChange={setSearchCity}
                />
                <CommandList>
                  <CommandEmpty className="py-2 px-4 text-sm">
                    {searchCity ? (
                      <Button
                        variant="ghost"
                        className="w-full justify-start font-normal text-primary p-0 h-auto"
                        onClick={() => {
                          handleCreateCity(searchCity);
                          setOpenCity(false);
                          setSearchCity("");
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add "{searchCity}"
                      </Button>
                    ) : (
                      "No city found."
                    )}
                  </CommandEmpty>
                  <CommandGroup>
                    {cities
                      .filter((c) =>
                        c.name.toLowerCase().includes(searchCity.toLowerCase()),
                      )
                      .map((c) => (
                        <CommandItem
                          key={c.id}
                          value={c.name}
                          onSelect={(currentValue) => {
                            setCity(currentValue);
                            setOpenCity(false);
                            setSearchCity("");
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              city === c.name ? "opacity-100" : "opacity-0",
                            )}
                          />
                          {c.name}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label className="mb-1">Pays</Label>
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="mt-1 w-full rounded-md border px-2 py-1 bg-transparent"
          />
        </div>

        <div className="space-y-2 flex flex-col pt-1">
          <Label htmlFor="place" className="mb-1">
            Lieu
          </Label>
          <Popover open={openPlace} onOpenChange={setOpenPlace}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openPlace}
                className="w-full justify-between font-normal"
                disabled={fetchingPlaces}
              >
                {place || "Select a place..."}
                {fetchingPlaces ? (
                  <Spinner className="ml-2 h-4 w-4 opacity-50" />
                ) : (
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[--radix-popover-trigger-width] p-0"
              align="start"
            >
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search place..."
                  value={searchPlace}
                  onValueChange={setSearchPlace}
                />
                <CommandList>
                  <CommandEmpty className="py-2 px-4 text-sm">
                    {searchPlace ? (
                      <Button
                        variant="ghost"
                        className="w-full justify-start font-normal text-primary p-0 h-auto"
                        onClick={() => {
                          handleCreatePlace(searchPlace);
                          setOpenPlace(false);
                          setSearchPlace("");
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add "{searchPlace}"
                      </Button>
                    ) : (
                      "No place found."
                    )}
                  </CommandEmpty>
                  <CommandGroup>
                    {/* {places
                      .filter((p) =>
                        p.name
                          .toLowerCase()
                          .includes(searchPlace.toLowerCase()),
                      )
                      .map((p) => (
                        <CommandItem
                          key={p.id}
                          value={p.name}
                          onSelect={(currentValue) => {
                            setPlace(currentValue);
                            setOpenPlace(false);
                            setSearchPlace("");
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              place === p.name ? "opacity-100" : "opacity-0",
                            )}
                          />
                          {p.name}
                        </CommandItem>
                      ))} */}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div>
          <Label className="mb-1">Examens</Label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {EXAM_TYPES.map((ex) => (
              <label key={ex.value} className="inline-flex items-center gap-2">
                <Checkbox
                  checked={exams.includes(ex.value)}
                  onCheckedChange={(v) => {
                    setExams((prev) =>
                      v
                        ? Array.from(new Set([...prev, ex.value]))
                        : prev.filter((p) => p !== ex.value),
                    );
                  }}
                />
                <span className="text-sm">{ex.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-1">Niveaux</Label>
          <div className="mt-1 grid grid-cols-3 gap-2">
            {GERMAN_LEVELS.map((lv) => (
              <label key={lv.value} className="inline-flex items-center gap-2">
                <Checkbox
                  checked={levels.includes(lv.value)}
                  onCheckedChange={(v) => {
                    setLevels((prev) =>
                      v
                        ? Array.from(new Set([...prev, lv.value]))
                        : prev.filter((p) => p !== lv.value),
                    );
                  }}
                />
                <span className="text-sm">{lv.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-1">Spécialisations</Label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {SPECIALIZATIONS.map((sp) => (
              <label key={sp.value} className="inline-flex items-center gap-2">
                <Checkbox
                  checked={specializations.includes(sp.value)}
                  onCheckedChange={(v) => {
                    setSpecializations((prev) =>
                      v
                        ? Array.from(new Set([...prev, sp.value]))
                        : prev.filter((p) => p !== sp.value),
                    );
                  }}
                />
                <span className="text-sm">{sp.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <Label className="mb-1">Description</Label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full rounded-md border px-2 py-1 bg-transparent"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-white"
        >
          Créer
        </button>
      </div>
    </form>
  );
}
