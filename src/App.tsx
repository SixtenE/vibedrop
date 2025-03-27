import "./App.css";
import { useDropzone } from "react-dropzone";
import { supabase } from "./utils/supabase";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

// Upload file using standard upload
async function uploadFile(file: File) {
  console.log(file);
  const id = nanoid();

  const { data, error } = await supabase.storage.from("vibe").upload(id, file, {
    cacheControl: "3600",
    upsert: true,
    //svg type
    contentType: file.type,
  });
  if (error) {
    // Handle error
  } else {
    // Handle success
  }
  console.log(data);
}

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
    onDropAccepted: (files) => {
      uploadFile(files[0]);
    },
  });

  async function logFiles() {
    const { data, error } = await supabase.storage.from("vibe").list();
    if (error) return console.log(error);
    setFiles(data);
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
          {files.map((file) => (
            <li key={file.id}>
              <a
                href={`https://nbodsrunndqzztsvilcc.supabase.co/storage/v1/object/public/vibe//${file.name}`}
                target="_blank"
                rel="noreferrer"
              >
                {file.name}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}
