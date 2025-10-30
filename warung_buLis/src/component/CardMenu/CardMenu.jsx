import { useState } from 'react';
import './CardMenu.css'

const CardMenu = ({img,harga,nama,id}) => {

    // === USE STATE ===
    const [isChosen, setisChosen] = useState(false);

    // === FUNCTION ===
    const menuTerpilih = () => {
        // ubah state terpilih
        setisChosen(!isChosen);
        
        // simpan di slice
        // kurang slice
    }


  return (
    <div className={`cardMenu ${isChosen ? ('iYel') : ('iWhi')}`}>
        <img
            src={img} 
            alt="Gambar Tidak Valid"
            className='imgMenu'
        />
        <div className='infoMenu'>
            <span className='infoHargaMenu'>
                Rp {harga}
            </span><br />
            <span className='infoNamaMenu'>
                {nama}
            </span> <br />
            <div style={{width:'100%',textAlign:'center',marginBottom:'10px'}}>
                <button className='addToCartMenu' onClick={() => menuTerpilih()}>
                    Add To Cart
                </button>
            </div>
        </div>
    </div>
  )
}

export default CardMenu