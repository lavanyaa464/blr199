import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase.js'

export default function App(){
  const [products,setProducts]=useState([])
  const [filter,setFilter]=useState("All")
  const [search,setSearch]=useState("")
  const [cart,setCart]=useState(()=> JSON.parse(localStorage.getItem('blr_cart')||'[]'))
  const [showCart,setShowCart]=useState(false)

  useEffect(()=>{
    supabase.from('products').select(`
      *,
      product_images(image_url,is_primary),
      inventory(price,stock_qty),
      categories(name,slug)
    `).then(({data, error})=>{
      if(error) console.error(error)
      setProducts(data||[])
    })
  },[])

  useEffect(()=>{ localStorage.setItem('blr_cart', JSON.stringify(cart)) },[cart])

  const addToCart = (p)=>{
    const price = p.inventory?.[0]?.price || 199
    const existing = cart.find(c=>c.id===p.id)
    if(existing){ setCart(cart.map(c=> c.id===p.id ? {...c, qty:c.qty+1} : c)) }
    else { setCart([...cart, {id:p.id, name:p.name, price, qty:1}]) }
    setShowCart(true)
  }

  const total = cart.reduce((s,i)=>s+i.price*i.qty,0)
  const filtered = products.filter(p=>{
    const s = search.toLowerCase()
    const matchSearch = p.name.toLowerCase().includes(s)
    const cat = (p.categories?.slug||p.categories?.name||"").toLowerCase()
    const matchCat = filter==="All" || cat.includes(filter.toLowerCase()) || p.slug.includes(filter.toLowerCase())
    return matchSearch && matchCat
  })

  return (
    <div style={{minHeight:'100vh', background:'#fdf7ff', fontFamily:'system-ui'}}>
      {/* HEADER */}
      <div style={{position:'sticky', top:0, background:'white', padding:'12px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', zIndex:10}}>
        <b style={{fontSize:20}}>BLR199</b>
        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          <span style={{fontSize:13, color:'#666'}}>{products.length} products ✅</span>
          <button onClick={()=>setShowCart(true)} style={{padding:'8px 16px', borderRadius:20, background:'black', color:'white', border:'none', cursor:'pointer'}}>
            Cart ({cart.reduce((a,c)=>a+c.qty,0)}) - ₹{total}
          </button>
        </div>
      </div>

      <div style={{padding:20, maxWidth:1200, margin:'0 auto'}}>
        <h1 style={{fontSize:28, fontWeight:800}}>₹199 Collection</h1>
        
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search Rose, Lipstick, Scarf..."
          style={{margin:'14px 0', padding:'12px 18px', borderRadius:24, border:'1px solid #ddd', width:'100%', maxWidth:380}}/>

        <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:20}}>
          {["All","beauty","fashion","home","pets","stationery"].map(c=>(
            <button key={c} onClick={()=>setFilter(c)}
              style={{padding:'7px 14px', borderRadius:20, border:'1px solid #e5e5e5', cursor:'pointer', background:filter===c?'black':'white', color:filter===c?'white':'#333', textTransform:'capitalize'}}>
              {c}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))', gap:16}}>
          {filtered.map(p=>{
            const img = p.product_images?.find(i=>i.is_primary)?.image_url || p.product_images?.[0]?.image_url || `https://picsum.photos/seed/${p.id}/400/400`
            const price = p.inventory?.[0]?.price || 199
            return (
              <div key={p.id} style={{background:'white', borderRadius:16, overflow:'hidden', boxShadow:'0 4px 14px rgba(0,0,0,0.07)'}}>
                <img src={img} alt={p.name} style={{width:'100%', height:200, objectFit:'cover'}} />
                <div style={{padding:12}}>
                  <div style={{fontWeight:700, fontSize:14, height:38, overflow:'hidden'}}>{p.name}</div>
                  <div style={{fontSize:11, color:'#999', marginTop:4}}>{p.categories?.name||p.slug} • Stock: {p.inventory?.[0]?.stock_qty||10}</div>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10}}>
                    <b>₹{price}</b>
                    <button onClick={()=>addToCart(p)} style={{padding:'6px 12px', borderRadius:8, border:'none', background:'#111', color:'white', cursor:'pointer', fontSize:12}}>Add</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* CART DRAWER */}
      {showCart && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:50, display:'flex', justifyContent:'flex-end'}} onClick={()=>setShowCart(false)}>
          <div style={{width:380, maxWidth:'90vw', background:'white', height:'100%', padding:20, overflow:'auto'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h2>Cart ({cart.length})</h2>
              <button onClick={()=>setShowCart(false)} style={{border:'none', background:'#eee', padding:'6px 10px', borderRadius:8, cursor:'pointer'}}>X</button>
            </div>
            
            {cart.length===0 ? <p style={{marginTop:20, color:'#888'}}>Cart is empty</p> :
              <>
                {cart.map(item=>(
                  <div key={item.id} style={{display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid #eee'}}>
                    <div>
                      <b style={{fontSize:14}}>{item.name}</b><br/>
                      <small>₹{item.price} x {item.qty}</small>
                    </div>
                    <div style={{display:'flex', gap:6, alignItems:'center'}}>
                      <button onClick={()=>setCart(cart.map(c=>c.id===item.id?{...c, qty:Math.max(1,c.qty-1)}:c))} style={{padding:'2px 8px'}}>−</button>
                      <button onClick={()=>setCart(cart.map(c=>c.id===item.id?{...c, qty:c.qty+1}:c))} style={{padding:'2px 8px'}}>+</button>
                      <button onClick={()=>setCart(cart.filter(c=>c.id!==item.id))} style={{color:'red', border:'none', background:'none', cursor:'pointer'}}>Remove</button>
                    </div>
                  </div>
                ))}
                <div style={{marginTop:20, fontWeight:800, fontSize:18}}>Total: ₹{total}</div>
                <button onClick={()=>{alert(`Order placed! Total ₹${total} - BLR199`); setCart([]); setShowCart(false)}} style={{marginTop:12, width:'100%', padding:14, background:'black', color:'white', border:'none', borderRadius:12, cursor:'pointer', fontWeight:700}}>Checkout ₹{total}</button>
                <button onClick={()=>setCart([])} style={{marginTop:8, width:'100%', padding:10, background:'#eee', border:'none', borderRadius:10, cursor:'pointer'}}>Clear Cart</button>
              </>
            }
          </div>
        </div>
      )}
    </div>
  )
}