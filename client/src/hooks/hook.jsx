import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const useErrors = (errors = [])=>{

    errors.forEach(({isError,error,fallback})=>{
        if(isError){
            if(fallback) fallback();
            else toast.error(error?.data?.message || "Something went wrong")
        }
    })
    useEffect(()=>{

      },[errors])
}

const useAsyncMutuation = (mutationHook)=>{
    const [isLoading, setIsLoading] = useState(false);
    const [data,setData] = useState(null)
    const [mutuate] = mutationHook()
    const executeMutuation = async (toastMessage,...args)=>{
        setIsLoading(true)
        const toastId = toast.loading(toastMessage || "Updating data ....")
        try {
            const res = await mutuate(...args)
            if(res.data){
            setData(res.data)
              toast.success(res.data.message || "Updated data sucessfully",{id:toastId})
            }
            else{
              toast.error(res?.error?.data?.message || "Something went wrong",{id:toastId})
            }
          } catch (error) {
            toast.error("Something went wrong",{id:toastId})
          }finally{
            setIsLoading(false)
        }
    }

    return [executeMutuation,isLoading,data]
}

export {useErrors,useAsyncMutuation}