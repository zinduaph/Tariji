import { ListChecksIcon, Proportions, Mail } from 'lucide-react'
import {Link} from 'react-router-dom'
const Sidebar = () => {
    return (
        <div className="w-[18%] min-h-screen mt-10 p-5 border-r-2">
            <div className="flex flex-col gap-3">
                <Link to={'/users'}>
                <ListChecksIcon size={18} className='text-orange-500'/>
                <span>All users</span>
                </Link>

                <Link to='/userProducts'>
                <Proportions size={18} className='text-orange-500'/>
                <span>user's sales</span>
                </Link>

                <Link to='/send-email'>
                <Mail size={18} className='text-orange-500'/>
                <span>Send email</span>
                </Link>

            </div>

        </div>
    )
}
export default Sidebar