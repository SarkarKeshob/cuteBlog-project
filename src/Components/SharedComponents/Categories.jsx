import { Link } from "react-router-dom";
import { category } from "../../Data/Data";
import { useState } from "react";
import { BiAlignLeft } from "react-icons/bi";


const Categories = () => {
    const [showCatBar,setShowCatBar]=useState(false);

    return (
        <div>
            <BiAlignLeft className="block md:hidden" onClick={()=>setShowCatBar(!showCatBar)}/>
            <section className={`md:grid md:gap-5 ${showCatBar?'grid gap-3':'hidden'}`}>
                {category.map(catItem=><Link to={`/categories/${catItem.name}`} key={catItem.id} className="tooltip tooltip-right hover:tooltip-open flex items-center gap-2" data-tip={`${catItem.name}`}>
                    {catItem.icon} <label className="text-xs lg:hidden">{catItem.name}</label>
                    </Link>
                )}
            </section>
        </div>
    );
};

export default Categories;