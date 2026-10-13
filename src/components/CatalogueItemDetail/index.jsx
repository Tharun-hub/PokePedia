import './index.css'
import { useParams } from 'react-router'

function CatalogueItemDetail()
{
    const {id} = useParams();
    console.log(id);
    return(
        <div>
            <h1>
                
            </h1>
        </div>
    )
}
export default CatalogueItemDetail