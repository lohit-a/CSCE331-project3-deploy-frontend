import {useState, useEffect} from 'react'
import './CashierPage.css';

function CashierPage() {

    const[cashiers, setCashiers] = useState([])
    const[inventoryitems, setInventoryItems] = useState([])

    const fetchCashiers = async () => {
        try {
            const response = await fetch('http://localhost:8081/cashiers'); // https://proj3-t62-backenddeploy-production.up.railway.app/
            const data = await response.json();
            setCashiers(data.content);
        } catch (error) {
            console.error('Error fetching cashiers:', error);
        }
    };

    useEffect(() => {
        fetchCashiers();
        console.log(cashiers)
    }, [])


    return (
        <div className="cashier-page">
            {cashiers.map((cashier) => (
                <div className='cashier'>
                    <h1>{cashier.cashierId}</h1>
                    <h1>{cashier.firstName}</h1>
                    <h1>{cashier.lastName}</h1>
                </div>
            ))}
        </div>     
    );
}

export default CashierPage;