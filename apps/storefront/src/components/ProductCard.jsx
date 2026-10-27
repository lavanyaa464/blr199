export default function ProductCard({p, onAdd}) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg p-3 flex flex-col">
      <img src={p.image} alt={p.name} className="h-40 object-cover rounded-lg"/>
      <h3 className="font-semibold mt-2 line-clamp-2">{p.name}</h3>
      <p className="text-pink-600 font-bold">₹{p.price}</p>
      <p className="text-xs text-gray-500">{p.stock>0?`${p.stock} in stock`:"Out of stock"}</p>
      <button onClick={()=>onAdd(p)} className="mt-2 bg-black text-white py-2 rounded-full hover:bg-gray-800">Add to Cart</button>
    </div>
  )
}