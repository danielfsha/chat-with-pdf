'use client'

import { useRouter } from 'next/navigation'

import {useState} from 'react'

import { useUser } from '@clerk/nextjs';

import {v4 as uuidv4} from 'uuid'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '@/firebase';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import generateEmbeddings from '@/actions/generateEmbeddings';

export enum Statuses {
  Uploading = 'uploading your file',
  Paused = 'paused uploading file',
  Running = 'running file upload',
  Success = 'successfully uploaded file',
  Saving = 'saving the document in the database',
  GeneratingEmbeddings = 'generating embeddings',
  Error = 'error occured while uploading file',
}

export type Status = Statuses[keyof Statuses];

function useUploadFile() {
    const [progress, setProgress] = useState<number>(0);
    const [status, setStatus] = useState<Status | null>(null);
    const [fileId, setFileId] = useState<string | null>(null);

    const {user} = useUser();
    const router = useRouter();


    const handleUpload = async (file: File) => {
        if (!user || !file) return
        
        // plan limitations for free or pro plan users
        const id = uuidv4(); 

        // where to store the file
        const storageRef = ref(storage, `users/${user.id}/files/${id}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed', 
            (snapshot) => {
                const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(percentage);
                setStatus(Statuses.Uploading);
                console.log('Upload is ' + percentage + '% done');

                switch (snapshot.state) {
                    case 'paused':
                        setStatus(Statuses.Paused);
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        setStatus(Statuses.Running);
                        console.log('Upload is running');
                        break;
                }
            }, 
            (error) => {
                setStatus(Statuses.Error);
                console.log('Error uploading file', error);
            }, 
            async () => {
                // upload is done
                setStatus(Statuses.Success);

                getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
                    setStatus(Statuses.Saving);
                    await setDoc(doc(db, 'users', user.id, 'files', id), {
                        name: file.name,
                        url: downloadURL,
                        size: file.size,
                        type: file.type,
                        createdAt: Timestamp.now(),
                        updatedAt: Timestamp.now(),
                    });
                    console.log('File available at', downloadURL);
                });
                
                // where the file is stored in the database
                setFileId(id);

                // start generating embeddings
                setStatus(Statuses.GeneratingEmbeddings);

                
                console.log('Generating embeddings...');
                await generateEmbeddings(id);
            }
        );
    }

    return {
        progress,
        status,
        fileId,
        handleUpload
    }
}

export default useUploadFile