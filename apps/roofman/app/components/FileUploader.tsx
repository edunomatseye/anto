import { ChangeEvent, useState } from 'react';
import axios from 'axios';

export function FileUploader() {
  type TStatus = 'idle' | 'uploading' | 'error';

  const url = 'https://httpbin.org/post';

  const [file, setFile] = useState<File | undefined>(undefined);
  const [Status, setStatus] = useState<TStatus>('idle');

  async function handleFileUpload() {
    const formData = new FormData();

    file && formData.append('file', file);
    setStatus('uploading');
    await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return;
  }

  return (
    <div>
      <input
        type="file"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setStatus('idle');
          setFile(e.target.files?.[0]);
        }}
      />
      <div>
        {file && (
          <div>
            <div>File Name: {file.name}</div>
            <br />
            <div>File Size: {file.size}</div>
            <br />
            <div>File Type: {file.type}</div>
            <br />
          </div>
        )}
      </div>
      <button onClick={handleFileUpload}>
        {Status === 'idle' ? 'Upload' : 'Uploading...'}
      </button>
    </div>
  );
}
