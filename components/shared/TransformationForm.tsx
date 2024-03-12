"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "../ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { aspectRatioOptions, defaultValues, transformationTypes } from "../../constants"
import { CustomField } from "./CustomField"
import { useState, useTransition } from "react"
import { AspectRatioKey, debounce, deepMergeObjects } from "../../lib/utils"
import { updateCredits } from "../../lib/actions/user.actions"
import { MediaUploader } from "./MediaUploader"

export const formSchema = z.object({
  title:z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt:z.string().optional(),
  publicId:z.string(),
})

export const TransformationForm = ({action,data =null,userId,type,creditBalance,config=null}:TransformationFormProps) => {
    const transformationType=transformationTypes[type]
    const [image,setImage]= useState(data)
    const [newTransformation,setNewTransformation]= useState<Transformations| null>(null);
    const [isSubmitting,setIsSubmitting]=useState(false)
    const [isTranforming,setIsTranforming]=useState(false)
    const [TranformationConfig,setTransformationConfig]= useState(config)
    const[isPending,startTransition]= useTransition()
    const initialValues = data && action ==='Update' ? {
      title:data?.title,
      aspectRatio: data?.aspectRatio,
      color: data?.color,
      prompt:data?.prompt,
      publicId:data?.publicId,
    } :defaultValues
          // 1. Define your form.
     const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues,
          })
         
          // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
            console.log(values)
          }
    const onselectFieldHandler=(value :string,onChangeField:(value:string)=>void)=>{
      console.log(value)
      const imageSize=aspectRatioOptions[value as AspectRatioKey]
      
        setImage((prevState:any)=>({
          ...prevState,
          aspectRatio:imageSize.aspectRatio,
          width:imageSize.width,
          height:imageSize.height
        }))
        setNewTransformation(transformationType.config)
        return onChangeField(value)
    }
    const onInputChangeHandler=(fieldName:string,value:string,type:string,onChangeField:(value:string)=>void)=>{
        debounce(()=>{
            setNewTransformation((prevState:any)=>({
                ...prevState,
                [type]:{
                  ...prevState?.[type],
                  [fieldName==='prompt' ? 'publicId':'to']:value
                }
            }))
        
        },1000)

    }
    const  onTransformHandler =()=>{
      setIsTranforming(true)
      setTransformationConfig(
        deepMergeObjects(newTransformation,setTransformationConfig)
      )
      setNewTransformation(null)
      startTransition(async()=>{
       // await updateCredits(userId,creditFee)
      })
    }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomField 
          control={form.control}
          name="title"
          formLabel ="Image Title"
          className="w-full  text-black mt-12"
          render={({field})=> <Input {...field} className="border-black/15"/>}

        />
        {type ==="fill" &&
            <CustomField 
            control={form.control}
             name="aspectRatio"
            formLabel ="Aspect Ration"
            className="w-full text-black "
            render={({field})=>(
              <Select
                onChange={(value)=> onselectFieldHandler(value,field,onChange)}
              >
            <SelectTrigger className="select-field">
            <SelectValue placeholder="select size" />
          </SelectTrigger>
           <SelectContent>
            {Object.keys(aspectRatioOptions).map((key)=>(
                <SelectItem key={key} value={key} className="select-item">
                  {aspectRatioOptions[key as AspectRatioKey].label}
                </SelectItem>
            ))
            
            }
              
           </SelectContent>
         </Select>)}
          />
        }
        {(type ==="remove" || type ==="recolor") &&
            <CustomField 
            control={form.control}
             name="prompt"
            formLabel ={type==="remove"?"Object to remove":"Object to recolor"}
            className="w-full text-black "
            render={({field})=>(
              <input
                value={field.value}
                className="input-field w-full"
                onChange={(e)=>onInputChangeHandler("prompt",
                e.target.value,type,field.onChange)}
              />
              )}
          />

        }
        {type ==="recolor"  &&
            <CustomField 
            control={form.control}
             name="prompt"
            formLabel ="Replacement Color"
            className="w-full text-black "
            render={({field})=>(
              <input
                value={field.value}
                className="input-field w-full"
                onChange={(e)=>onInputChangeHandler("color",
                e.target.value,"recolor",field.onChange)}
              />
              )}
          />
          
        }

        <div className="media-uploader-field">
          <CustomField 
            control={form.control}
            name="publicId"
            className="flex size-full flex-col"
            render={({field})=>(
              <MediaUploader
                onValueChange={field.onChange}
                setImage={setImage}
                publicId={field.value}
                image={image}
                type={type}
              />
            )}

          />
        </div>
        <div className="flex flex-col gap-4">
          <Button type="button" 
            className="submit-button capitalize"
            disabled={isTranforming||isSubmitting ===null}
            onClick={onTransformHandler}
            >
            {isTranforming? 'Transforming ...':'Apply Transformation'}
           </Button>

           <Button type="submit" 
            className="submit-button capitalize"
            disabled={isSubmitting}
            >
            {isTranforming? 'Submiting ...':'Save Image'}
           </Button>

        </div>
        
        
        
          

      </form>
    </Form>
  )
}
