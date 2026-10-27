export default function Header({cartCount, onSearch}) {
  return (
    <header className="bg-black text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-black">BLR<span className="text-pink-500">199</span></h1>
        <div className="flex-1 mx-6 max-w-md">
          <input onChange={e=>onSearch(e.target.value)} placeholder="Search ₹199 products..." className="w-full px-4 py-2 rounded-full text-black outline-none"/>
        </div>
        <div className="flex gap-4">
          <span>Cart: {cartCount}</span>
        </div>
      </div>
    </header>
  )
}