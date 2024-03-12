import { useToast } from "../ui/use-toast"
import {CldUploadWidget} from 'next-cloudinary'

export const MediaUploader = () => {
  const {toast} = useToast()
  const onUploadSuccessHandler=(result:any)=>{
    toast({
        title:"Image Uploaded Successfully",
        description:"1 credit was deducted from your account",
        duration:5000,
        className:'success-toast'

    })

  }
  const onUploadErrorHandler=(result:any)=>{
    toast({
        title:"Spmthing went wrong while uploading",
        description:"Please try again",
        duration:5000,
        className:'error-toast'

    })
  }
    return (
        <CldUploadWidget
            uploadPreset="benyahdou_imageIA"
            options={{
                multiple:false,
                resourceType:"image"
            }}
            onSuccess={onUploadSuccessHandler}
            onError={onUploadErrorHandler}
        >

        </CldUploadWidget>
  )
}
