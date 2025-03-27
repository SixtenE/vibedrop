import "./App.css";
import { useDropzone } from "react-dropzone";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client
const supabase = createClient(
  "https://nbodsrunndqzztsvilcc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ib2RzcnVubmRxenp0c3ZpbGNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2MTgyMDUsImV4cCI6MjA1MzE5NDIwNX0.mYnhoewTWWhA47PtEMXiqW9bx6zTkQN19GKCoQjGzk8"
);

// Upload file using standard upload
async function uploadFile(file: File) {
  const { data, error } = await supabase.storage
    .from("vibe")
    .upload("charles", file);
  if (error) {
    // Handle error
  } else {
    // Handle success
  }
  console.log(data);
}

export default function App() {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>{`${file.path} - ${file.size} bytes`}</li>
  ));

  return (
    <section className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
      <button
        disabled={acceptedFiles.length === 0}
        onClick={async () => {
          uploadFile(acceptedFiles[0]);
        }}
      >
        Upload
      </button>
    </section>
  );
}
