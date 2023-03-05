import toast, { Toaster } from 'react-hot-toast';

const notify = () => toast.success('Here is your toast.');

export default function Toasted ({ }) {
  return ( <div>
    <button onClick={notify}>Make me a toast</button>
    <Toaster />
  </div>

  )
}