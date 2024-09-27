import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadThing } from "../utils/uploadthing";
import { Button } from "./ui/button";

export default function UploadForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res) {
        setUploadedFiles((prev) => [...prev, ...res.map((file) => file.url)]);
        console.log("Files uploaded successfully!", res);
      }
      setUploading(false);
      setFiles([]);
    },
    onUploadError: (error: Error) => {
      console.error("Error uploading files:", error);
      setUploading(false);
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
    },
  });

  const handleUpload = async () => {
    try {
      setUploading(true);
      const result = await startUpload(files);
      if (result) {
        console.log("Upload started:", result);
      } else {
        console.error("Upload failed to start");
        setUploading(false);
      }
    } catch (error) {
      console.error("Error during upload:", error);
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Upload Files</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Drag and drop your files here or click to select files to upload.
        </p>
      </div>
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      {files.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Selected Files:</h2>
          <ul className="list-disc pl-5">
            {files.map((file) => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
      <Button onClick={handleUpload} disabled={files.length === 0 || uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </Button>
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Uploaded Files:</h2>
          <ul className="list-disc pl-5">
            {uploadedFiles.map((url, index) => (
              <li key={index}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}