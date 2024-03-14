import { useToast } from "../ui/use-toast"
import {CldUploadWidget} from 'next-cloudinary'

type MediaUploaderProps = {
    onValueChange: (value: string) => void;
    // this how to specify react state 
    setImage: React.Dispatch<any>;
    publicId: string;
    image: any;
    type: string;
  }

export const MediaUploader = ( {onValueChange,
    setImage,
    image,
    publicId,
    type
  }: MediaUploaderProps) => {
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
            {({open})=>(
                <div className="flex flex-col gap-4">
                    <h3 className="h3-bold">
                        Original
                    </h3>
                    {publicId ? (
                        <>
                        here is the image to display
                        </>
                    ):(<div>
                        here is no Images to dispay
                    </div>)}
                </div>
            )}
        </CldUploadWidget>
  )
}
