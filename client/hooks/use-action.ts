import { useState } from "react"
import { toast } from "sonner"

const useAction = () => {
    const [isLoading, setIsLoading] = useState(false)

    function onError(message: string) {
        setIsLoading(false)
        toast(message)
    }

    return { isLoading, setIsLoading, onError }
}

export default useAction