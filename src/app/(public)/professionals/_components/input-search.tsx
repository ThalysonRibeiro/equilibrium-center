"use client"
import { Search } from "lucide-react";

interface InputSearchProps {
  search: string;
  setSearch: (value: string) => void;
}

export function InputSearch({ search, setSearch }: InputSearchProps) {

  return (
    <div className="flex h-10 w-full justify-center items-center outline-0 bg-transparent backdrop-blur-sm border focus-within:border-ring rounded-lg">
      <div className="border-r px-2 hidden md:flex">
        <Search className="text-gray-500" />
      </div>
      <input
        type="text"
        className="outline-0 w-full h-10 px-2"
        placeholder="Pesquisar por nome ou serviço..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
    </div>
  )
}