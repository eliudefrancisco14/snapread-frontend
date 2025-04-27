'use client';

import * as React from "react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type fileType = {
  text: string
}

export function CardView() {
    const [file, setFile] = React.useState<File | null>(null)
    const [text, setText] = React.useState<string>("")
    const [loading, setLoading] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string>("")
    const baseURL = process.env.NEXT_PUBLIC_API_URL

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setFile(file)
        }
    }
    const handleSubmit = async () => {
        if (!file) {
            setError("Please select a file")
            return
        }
        setLoading(true)
        setError("")
        const formData = new FormData()
        formData.append("file", file)
        console.log("Base URL:", baseURL)
        try {
            const response = await axios.post<fileType>(`${baseURL}/api/snapread/ocr`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            // console.log(response.data)
            setText(response.data.text)
        } catch (error) {
            setError("Error processing file")
        } finally {
            setLoading(false)
        }
    }
  return (
    <Card className="w-500 sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[700px] 2xl:w-[800px]">
      <CardHeader>
        <CardTitle>Convert image to text</CardTitle>
        <CardDescription>Extract the text of image with just one click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-2">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Image (jpg, jpeg or png)</Label>
                <Input
                    type="file"
                    id="name"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={loading}
                />
                {file && <p className="text-sm text-gray-500">{file.name}</p>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Result</Label>
                <textarea
                    rows={5}
                    cols={33}
                    id="framework"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled
                    placeholder="Result will be shown here"
                    className="w-full p-2 border rounded-md resize-y"
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
                {loading && <p className="text-sm text-gray-500">Loading...</p>}
              
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button className="cursor-pointer" variant="outline" onClick={() => setText("")} disabled={loading}>
          Clear
        </Button>
        <Button onClick={() => handleSubmit()} className="cursor-pointer" disabled={loading}>
          {loading ? "Loading..." : "Submit"}
        </Button>
      </CardFooter>
    </Card>
  )
}
