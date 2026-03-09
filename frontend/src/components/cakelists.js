import React, { useEffect, useState } from "react";
import axios from "axios";

function CakeList() {

const [cakes,setCakes] = useState([]);

useEffect(()=>{

axios.get("http://127.0.0.1:8000/api/cakes/")
.then(res=>{
setCakes(res.data)
})

},[])

return(

<div>

<h2>Cake Menu</h2>

{cakes.map(cake=>(
<div key={cake.id}>
<h3>{cake.name}</h3>
<p>₱{cake.price}</p>
<p>{cake.description}</p>
</div>
))}

</div>

)

}

export default CakeList;

