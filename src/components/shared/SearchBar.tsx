import { Search } from "lucide-react"


const SearchBar = () => {
  return (
    <div className="border-[1px] w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer">
     <div className="flex flex-row items-center justify-between">
        <div className="text-sm font-semibold px-6">search for agents</div>
        <div className="hidden sm:block text-sm font-semibold px-6 border-x-[1px] flex-1 text-center">category</div>
        <div className="text-sm pl-6 pr-2 text-grey-600 flex flex-row items-center gap-3">
            <div className="hidden sm:block">Model type</div>
            <div className="p-2 bg-primary-blue rounded-full text-white">
                <Search className="h-5 w-5"/>
            </div>
        </div>
     </div>
    </div>
  )
}

export default SearchBar