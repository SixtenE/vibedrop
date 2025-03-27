import "./App.css";
import { useDropzone } from "react-dropzone";
import { supabase } from "./utils/supabase";
// import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { main } from "./utils/s3";

// Upload file using standard upload
// async function uploadFile(file: File) {
//   console.log(file);
//   const id = nanoid();

//   const { data, error } = await supabase.storage.from("vibe").upload(id, file, {
//     cacheControl: "3600",
//     upsert: true,
//     //svg type
//     contentType: file.type,
//   });
//   if (error) {
//     // Handle error
//   } else {
//     // Handle success
//   }
//   console.log(data);
// }

export default function App() {
  const [files, setFiles] = useState<
    {
      name: string;
      bucket_id: string;
      owner: string;
      id: string;
      updated_at: string;
      created_at: string;
      last_accessed_at: string;
    }[]
  >([]);

  const { getRootProps, getInputProps } = useDropzone({
    onDropAccepted: async (files) => {
      await main(files[0]);
      logFiles();
    },
  });

  async function logFiles() {
    const { data, error } = await supabase.storage.from("vibe").list();
    if (error) return console.log(error);
    setFiles(data.sort((a, b) => (a.created_at > b.created_at ? -1 : 1)));
  }

  useEffect(() => {
    logFiles();
  }, []);

  return (
    <section className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>
          {files
            .filter((files) => files.name !== ".emptyFolderPlaceholder")
            .map((file) => (
              <li key={file.id}>
                <img
                  src={`https://nbodsrunndqzztsvilcc.supabase.co/storage/v1/object/public/vibe//${file.name}`}
                  alt={file.name}
                />
              </li>
            ))}
        </ul>
      </aside>
    </section>
  );
}
